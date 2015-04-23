(function (app) {
    "use strict";

    function RootController($scope, $location, config, socketService, localStorageService) {
        $scope.channels = {
            current: null,
            all: [],
            setCurrent: function (channel) {
                this.current = channel;
            },
            setAll: function (allChannels) {
                this.all = allChannels;
            },
            commitNew: function ($event) {
                var enterKey = 13;
                if (!$scope.newChannelName || ($event && $event.keyCode !== enterKey)) {
                    return;
                }

                this.commit({name: $scope.newChannelName});
                delete $scope.newChannelName;
            },
            delete: function (channel) {
                socketService.emit(config.events.deleteChannel, channel);
            },
            commit: function (channel) {
                socketService.emit(config.events.updateChannel, channel);
            },
            commitMessage: function () {
                this.current.newMessage.channelId = this.current.id;
                socketService.emit(config.events.addMessageToChannel, this.current.newMessage);
                this.current.newMessage = null;
            }
        };

        $scope.userInfo = {
            initialize: function () {
                var loaded = localStorageService.load();
                if (loaded) {
                    this.name = loaded.name;
                }
            },
            save: function () {
                localStorageService.save(this);
                socketService.emit(config.events.updateUserInfo, this.name);
            }
        };

        $scope.status = {
            set: function () {
                var args = Array.prototype.slice.call(arguments);
                this.message = args.length > 1 ? args.join("") : args[0];
                this.date = new Date();
            }
        };

        function initializeSocketService(service) {
            service.on(config.events.initialize, function (channels) {
                $scope.channels.setAll(channels);

                // this is a test.. not sure it works!
                socketService.emit(config.events.updateUserInfo, $scope.userInfo.name);
            });

            service.on(config.events.updateChannel, function (channel) {
                var existingChannel = _.findWhere($scope.channels.all, {id: channel.id});

                if (!existingChannel) {
                    $scope.status.set("A new channel with the name '", channel.name, "' was created.");
                    $scope.channels.all.push(channel);
                } else {
                    $scope.status.set("The channel with the name '", channel.name, "' was updated.");

                    var existingIndex = _.findIndex($scope.channels.all, existingChannel);
                    if (existingIndex > -1) {
                        $scope.channels.all[existingIndex] = channel;
                    }

                    if ($scope.channels.current && $scope.channels.current.id === channel.id) {
                        $scope.channels.setCurrent(channel);
                    }
                }
            });

            service.on(config.events.deleteChannel, function (toDelete) {
                angular.forEach($scope.channels.all, function (c, index) {
                    if (c.id === toDelete.id) {
                        $scope.channels.all.splice(index, 1);

                        if (c.id === $scope.channels.current.id) {
                            $location.url("/");
                        }

                        $scope.status.set("The channel with the name '", toDelete.name, "' has been deleted.")

                        return;
                    }
                });
            });

            service.on(config.events.updateSessionInfo, function (sessionInfo) {
                $scope.sessionInfo = sessionInfo;
            });

            service.on(config.events.updateStatus, function (message) {
                $scope.status.set(message);
            });

            service.on(config.events.disconnect, function () {
                $scope.status.set("The server has decided to go offline.. Or there might be other issues.. ;)");
            });

            $scope.status.set("Welcome to ", config.appName, ", have fun!");
        }

        function initialize() {
            // register controller functions on socketService
            initializeSocketService(socketService);

            // load userInfo from localStorage if available
            $scope.userInfo.initialize();

            // config object needs to be on scope in order to be able to use it in filter directives
            $scope.config = config;

            $scope.$on("$routeChangeSuccess", function (event, current) {
                // we need to ensure there is no channel set when we return from a specific channel
                if (!current.params.channelId) {
                    $scope.channels.setCurrent(null);
                }
            });
        }

        initialize();
    }

    RootController.$inject = ["$scope", "$location", "config", "socketService", "localStorageService"];
    app.controller("rootController", RootController);

    function ChannelController($scope, $routeParams, $location) {
        $scope.$watch("channels.all", function (newValue) {
            if (newValue && newValue.length) {
                var channel = _.findWhere(newValue, {id: $routeParams.channelId});

                // we always set the current channel (if its undefined or not)
                $scope.channels.setCurrent(channel);

                if (!channel) {
                    $location.url("/");
                }
            }
        });
    }

    ChannelController.$inject = ["$scope", "$routeParams", "$location"];
    app.controller("channelController", ChannelController);
}(fastChanApp));