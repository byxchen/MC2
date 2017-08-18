angular.module('Controllers', [])
.controller("landingController", function ($scope, $routeParams) {

    $scope.hideMenu = true;

    $scope.menuOnClick = function (e) {
        $scope.hideMenu = !$scope.hideMenu;
    }
});