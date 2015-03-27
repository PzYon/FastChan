(function (app) {
    "use strict";

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
            registerFileUpload: function (channelId) {
                var uploader = new SocketIOFileUpload(socket);

                uploader.listenOnDrop(document.getElementById("dropZone"));

                uploader.addEventListener(config.fileUpload.events.start, function (event) {
                    event.file.meta[config.fileUpload.channelId] = channelId;
                });
            }
        };
    }]);
}(fastChanApp));