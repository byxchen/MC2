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
            sendResult: null,
            connected: false
        };

        $scope.startController = function() {
            if ($rootScope.chatController) clearInterval($rootScope.chatController);
            $rootScope.chatController = setInterval(function () {
                $socket.emit("admin_get_status", {token: $scope.controller.token}, function (data) {
                    $scope.controller.people = data.online;
                    $scope.controller.status = data.status;

                });
            }, 1000);
        };

        $scope.settings = {};

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
                    url: "/v1/api/chat/start",
                    success: function (result) {
                        $scope.controller.connected = true;
                        $scope.$apply();
                    }
                })
            }
        };


            $.ajax({
                url: "/v1/api/session/current",
                success: function (result) {
                    $rootScope.user = result;
                    $scope.controller.connected = result.connected;

                    $scope.$apply();
                }
            });

        $.ajax({
            url: "/v1/api/settings/chat",
            success: function (result) {
                $scope.settings = result;
                $scope.$apply();
            }
        })

    });

