var App = angular.module('ChatRoom',['ngResource','ngRoute','ngStorage','socket.io','ngFileUpload','Controllers','Services'])
.run(["$rootScope", function ($rootScope){
	$rootScope.baseUrl = 'https://ice-mc2.herokuapp.com/'; //Application URL
}]);
App.config(function ($routeProvider, $socketProvider){
	$socketProvider.setConnectionUrl('https://ice-mc2.herokuapp.com/'); // Socket URL

	$routeProvider	// AngularJS Routes
	.when('/v1/', {
		templateUrl: 'app/views/login.html',
		controller: 'loginCtrl'
	})
	.when('/v1/ChatRoom', {
		templateUrl: 'app/views/chatRoom.html',
		controller: 'chatRoomCtrl'
	})
	.otherwise({		
        redirectTo: '/v1/'	// Default Route
    });
});
