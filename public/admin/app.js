var App = angular.module('Admin',['ngRoute','ngStorage','socket.io','Controllers'])
    .run(["$rootScope", function ($rootScope){
        //$rootScope.baseUrl = 'http://142.1.93.22:8080'; //Application URL
    }]);
App.config(function ($routeProvider, $locationProvider){
    //$socketProvider.setConnectionUrl('http://142.1.93.22:8080'); // Socket URL
    $routeProvider	// AngularJS Routes
        .when('/dashboard', {
            templateUrl: 'dashboard.html',
            controller: 'dashboardController'
        })
        .when('/chat', {
            templateUrl: 'chat.html',
            controller: 'chatController'
        })
        .otherwise({
            redirectTo: '/dashboard',	// Default Route
            templateUrl: 'dashboard.html',
            controller: 'dashboardController'
        });

    $locationProvider.html5Mode(true);
});
