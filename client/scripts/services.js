(function (app) {
    "use strict";

    app.factory("channelService", ["config", "socketService", function (config, socketService) {

        return {
            current: null,

            all: [],

            setCurrent: function (channel) {
                this.current = channel;
            },

            setAll: function (allChannels) {
                this.all = allChannels;
            },

            commitNew: function ($event, newChannelName) {
                var enterKey = 13;
                if (!newChannelName || ($event && $event.type !== "click" && $event.keyCode !== enterKey)) {
                    return;
                }

                this.commit({name: newChannelName});
                //delete newChannelName;
            },

            delete: function (channel) {
                socketService.emit(config.events.deleteChannel, channel);
            },

            commit: function (channel) {
                socketService.emit(config.events.updateChannel, channel);
            },

            commitMessage: function (channel) {
                channel.newMessage.channelId = channel.id;
                socketService.emit(config.events.addMessageToChannel, channel.newMessage);
                channel.newMessage = null;
            }
        };

    }]);

    app.factory("localStorageService", [function () {

        var key = "fastChanApp";
        return {
            save: function (value) {
                window.localStorage.setItem(key, angular.toJson(value));
            },

            load: function () {
                return angular.fromJson(window.localStorage.getItem(key));
            }
        };

    }]);

    app.factory("socketService", ["$rootScope", "config", function ($rootScope, config) {

        var socket = io.connect();
        var uploader;

        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },

            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            },

            ensureFileUpload: function ensureFileUpload(channelId, element) {
                if (ensureFileUpload.channelId === channelId) {
                    return;
                }

                ensureFileUpload.channelId = channelId;

                uploader = new SocketIOFileUpload(socket);
                uploader.listenOnDrop(element[0]);

                uploader.addEventListener(config.fileUpload.events.start, function (event) {
                    event.file.meta[config.fileUpload.channelId] = channelId;
                });
            },

            removeFileUpload: function () {
                if (uploader) {
                    uploader.destroy();
                }
            }
        };

    }]);

}(fastChanApp));