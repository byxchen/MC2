try {
    var constants = require("./constants.js");
    var crypto = require("crypto");

    var bodyParser = require("body-parser");
    const uuidv4 = require('uuid/v4');
    const moment = require('moment');

    var MongoClient = require('mongodb').MongoClient;
    var ObjectID = require("mongodb").ObjectID;

    var sessionRedirect = function (req, res, next) {
        if (!req.session.user && req.originalUrl !== "/favicon.ico") {
            req.session.redirectTo = req.originalUrl;
            return res.redirect("/login");
        }
        return next();
    };
} catch (e) {
    console.log("Could not initiate modules, check dependencies.");
}

function AdminView(socketController, expressApp) {
    this.ios = socketController;
    this.app = expressApp;

    this.controlSessionIds = {};

    this.app.use(bodyParser.json());


    this.setupRoute();
    this.setupApi();
    this.setupSocket();
}

AdminView.prototype.setupRoute = function () {
    this.app.get("/admin/:view", sessionRedirect, function (req, res, next) {
        if (constants.views.indexOf(req.params.view) !== -1)
            return res.sendfile(constants.adminIndexPath);
        else return next();
    });


};

var User = function(user){
    var salt = crypto.randomBytes(16).toString('base64');
    var hash = crypto.createHmac('sha512', salt);
    hash.update(user.password);
    this.username = user.username;
    this.salt = salt;
    this.saltedHash = hash.digest('base64');
};

var user = new User({username: "test", password: "test"});
MongoClient.connect(constants.dbUrl, function (err, db) {

        db.collection("users").insertOne(user, function (err2, newUser) {
            db.close();
        });
});

AdminView.prototype.setupApi = function () {
    this.app.post("/v1/api/login", function (req, res) {
        MongoClient.connect(constants.dbUrl, function (err, db) {
            db.collection("users").findOne({username: req.body.username}, function (err, user) {
                if (err) return res.status(500).end("Server error, could not resolve request");
                if (!user || !checkPassword(user, req.body.password)) return res.status(403).json({message: "Invalid username or password", status: 403});
                req.session.user = user;

                res.cookie('username', user.username, {httpOnly: false});

                res.json({username: user.username, redirect: req.session.redirectTo});
                delete req.session.redirectTo;

            });
        });
    });

    this.app.get("/v1/api/session/current", function (req, res) {
        return res.json({username: req.session.user ? req.session.user.username : null, token: req.session.user ? req.session.user.chatToken : null});
    });

    this.app.get("/v1/api/chat/token", function (req, res) {
        req.session.user.roomName = "test";
        req.session.user.chatToken = uuidv4();
        this.controlSessionIds[req.session.user.chatToken] = req.session.user;
        res.json({token: req.session.user.chatToken});
    }.bind(this));
};

AdminView.prototype.setupSocket = function () {
    this.ios.on('connection', function(socket){

        function setSessionVar(variable, value) {
            socket.handshake.session[variable] = value;
            socket.handshake.session.save();
        }

        function setSessionVars(object) {
            for (var variable in object) {
                socket.handshake.session[variable] = object[variable];
            }
            socket.handshake.session.save();
        }

        socket.on("start_admin_session", function (data, callback) {
            console.log(this.controlSessionIds);
            if (this.controlSessionIds[data.token]) {
                var user = this.controlSessionIds[data.token];

                setSessionVars({username: user.username, userAvatar: 'avatar1.jpg'});

                setSessionVar("isAdmin", true);


                callback({success: true, username: user.username});
            } else callback({success: false});
        }.bind(this));

        socket.on("admin_get_status", function (data, callback) {
            if (this.controlSessionIds[data.token]) {
                var user = this.controlSessionIds[data.token];
                if (!this.ios.sockets.adapter.rooms[user.roomName]) return callback({online: 0});
                callback({online: this.ios.sockets.adapter.rooms[user.roomName].length, status: "Online"})
            } else callback({status: "Offline"});
        }.bind(this));
    }.bind(this));
};

var checkPassword = function (user, password) {
    var hash = crypto.createHmac('sha512', user.salt);
    hash.update(password);
    var value = hash.digest('base64');
    return (user.saltedHash === value);
};

module.exports = AdminView;