angular.module('Controllers', [])
    .controller("registerController", function ($scope, $routeParams) {

        $scope.user = {};
        $scope.form = {code: $routeParams.code};
        $scope.success = false;

        $.ajax({
            url: "/v1/api/register/"+$routeParams.code,
            success: function (result) {
                $scope.user = result;
                $scope.$apply()
            }
        });

        $scope.onFormSubmit = function () {
            $.ajax({
                method: "POST",
                url: "/v1/api/register",
                data: $scope.form,
                success: function () {
                    $scope.success = true;
                }
            })
        }
    });