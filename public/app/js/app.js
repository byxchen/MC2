var App = angular.module('ChatRoom',['ngResource','ngRoute','ngStorage','socket.io','ngFileUpload','Controllers','Services'])
.run(["$rootScope", function ($rootScope){
	//$rootScope.baseUrl = 'http://142.1.93.22:8080'; //Application URL
}]);
App.config(function ($routeProvider, $socketProvider){
	//$socketProvider.setConnectionUrl('http://142.1.93.22:8080'); // Socket URL

	$routeProvider	// AngularJS Routes
	.when('/v1/:roomId', {
		templateUrl: 'app/views/login.html',
		controller: 'loginCtrl'
	})
	.when('/v1/ChatRoom/:roomId', {
		templateUrl: 'app/views/chatRoom.html',
		controller: 'chatRoomCtrl'
	})
	.otherwise({		
        redirectTo: '/v1/',	// Default Route
        templateUrl: 'app/views/login.html',
        controller: 'loginCtrl'
    });
});
