var fastChanApp = (function () {
    "use strict";

    var app = angular.module("fastChanApp", ["ngRoute", "ui.ace"]);

    app.config(function ($routeProvider) {
        $routeProvider.when("/channels/:channelId", {
            controller: "channelController",
            templateUrl: "partials/channel.html"
        }).when("/", {
            controller: "rootController",
            templateUrl: "partials/start.html"
        }).otherwise({
            redirectTo: "/"
        });
    });

    return app;

}());