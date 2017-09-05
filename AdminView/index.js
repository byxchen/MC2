
    var constants = require("./constants.js");
    var crypto = require("crypto");

    var bodyParser = require("body-parser");
    const uuidv4 = require('uuid/v4');
    const moment = require('moment');
    var csv = require('csv');

    var MongoClient = require('mongodb').MongoClient;
    var ObjectID = require("mongodb").ObjectID;

    var sessionRedirect = function (req, res, next) {
        if (!req.session.user && req.originalUrl !== "/favicon.ico") {
            req.session.redirectTo = req.originalUrl;
            return res.redirect("/login");
        }
        return next();
    };

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

var ChatSetting = function (settings) {
    if (!settings) {
        this.roomName = null;
        this.invite = false;
    }
    else {
        this.roomName = settings.roomName;
        this.invite = settings.invite;
    }

};

// var user = new User({username: "test", password: "test"});
// var settings = {
//     user: user.username,
//     chat: new ChatSetting()
// };
//
// MongoClient.connect(constants.dbUrl, function (err, db) {
//         db.collection("users").insertOne(user, function (err2, newUser) {
//             db.close();
//         });
// });
//
//     MongoClient.connect(constants.dbUrl, function (err, db) {
//         db.collection("settings").insertOne(settings, function (err2, newUser) {
//             db.close();
//         });
//     });

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
        return res.json({username: req.session.user ? req.session.user.username : null, connected: req.session.connected});
    });

    this.app.get("/logout", function (req, res) {
        req.session.destroy(function (err) {
            if (err) return res.status(err.code).end(err);

            return res.redirect("/");

        });
    });

    this.app.get("/v1/api/chat/start", function (req, res) {
        MongoClient.connect(constants.dbUrl, function (err, db) {
            db.collection("settings").findOne({user: req.session.user.username}, function (err, settings) {
                req.session.user.roomName = settings.chat.roomName;
                req.session.username = req.session.user.username;
                req.session.connected = true;
                req.session.isAdmin = true;
                req.session.userAvatar = 'avatar1.jpg';
                res.json({roomName: settings.chat.roomName});
            });
        });
    }.bind(this));

    this.app.get("/v1/api/students", function (req, res) {
        MongoClient.connect(constants.dbUrl, function (err, db) {
            db.collection("students").findOne({owner: req.session.user.username}, function (err, list) {
                if (!list) return res.json([]);
                res.json(list.students);
                db.close();
            });

        });
    });

    this.app.post("/v1/api/students", function (req, res) {
        csv.parse(Buffer.from(req.body.csv, "base64"), {columns: true}, function(err, data) {
            MongoClient.connect(constants.dbUrl, function (err, db) {

                db.collection("students").findOne({owner: req.session.user.username}, function (err, list) {
                    if (list) {
                        db.collection("students").updateOne({owner: req.session.user.username}, {
                            $set: {students: data}
                        }, function (err, result) {
                            res.json(result.students);
                            db.close();
                        })
                    }
                    else {
                        var entry = {
                            owner: req.session.user.username,
                            students: data
                        };
                        db.collection("students").insertOne(entry, function (err, result) {
                            res.json(result.students);
                            db.close();
                        });
                    }
                });

            });
        });
    });
    
    this.app.get("/v1/api/settings/:type", function (req, res) {
        MongoClient.connect(constants.dbUrl, function (err, db) {
            db.collection("settings").findOne({user: req.session.user.username}, function (err, settings) {
                res.json(settings[req.params.type]);
            });
        });

    });

    this.app.post("/v1/api/settings/:type", function (req, res) {
        MongoClient.connect(constants.dbUrl, function (err, db) {

                try {
                    switch (req.params.type) {
                        case "chat":
                            var newSettings = new ChatSetting(req.body.settings);
                            console.log(req.body.settings);
                            console.log(newSettings);
                            db.collection("settings").updateOne({user: req.session.user.username}, {$set: {chat: newSettings}}, function (err, result) {
                                res.json(newSettings);

                            });
                            break;
                        default:
                            return res.status(404).json({status: 404, message: "No such settings"});
                    }
                } catch (e) {
                    return res.status(500).json({status: 500, message: "Server error, could not resolve request"});
                }

            });

    });
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
            socket.handshake.session.reload(function (err) {

                if (socket.handshake.session.isAdmin) {
                    var user = socket.handshake.session.user;
                    if (!this.ios.sockets.adapter.rooms[user.roomName]) return callback({status: "Offline", online: 0});
                    callback({online: this.ios.sockets.adapter.rooms[user.roomName].length, status: "Online"})
                } else callback({status: "Offline", online: "0"});
            }.bind(this));

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