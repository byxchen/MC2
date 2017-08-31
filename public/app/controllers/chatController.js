angular.module('Controllers')
    .directive("iframeOnLoad", function(){
        return {
            scope: {
                onLoad: '&iframeOnLoad'
            },
            link: function(scope, element, attrs){
                element.on('load', function(){
                    return scope.onLoad();
                })
            }
        }})
    .controller("chatController", function ($scope, $rootScope, $routeParams, $socket) {
        $rootScope.tabActive = "chat";

        $scope.controller = {
            status: "Offline",
            people: 0,
            roomName: "test",
            sendResult: null,
            token: $rootScope.user ? $rootScope.user.token : null
        };

        $scope.startController = function() {
            
            setInterval(function () {
                $socket.emit("admin_get_status", {token: $scope.controller.token}, function (data) {
                    $scope.controller.people = data.online;
                    $scope.controller.status = data.status;

                });
            }, 1000);
        };

        $scope.Actions = {
            chatFullscreen: function () {
                var elem = $(".chat-room-frame")[0];
                var requestFullscreen = elem.requestFullscreen || elem.msRequestFullscreen || elem.mozRequestFullScreen || elem.webkitRequestFullscreen;
                requestFullscreen.call(elem);
            },
            sendTrackEmails: function () {
                $.ajax({
                    url: "/v1/api/test/sendTrackingEmail",
                    success: function (result) {
                        $scope.controller.sendResult = result;

                        $scope.$apply();
                    }
                })
            },
            getSessionToken: function () {
                $.ajax({
                    url: "/v1/api/chat/token",
                    success: function (result) {
                        $scope.controller.token = result.token;
                        $scope.$apply();
                    }
                })
            }
        };

        if (!$rootScope.user) {
            $.ajax({
                url: "/v1/api/session/current",
                success: function (result) {
                    $rootScope.user = result;
                    $scope.controller.token = result.token;

                    $scope.$apply();
                }
            })
        }
    });

