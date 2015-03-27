"use strict";

var url = require("url");

var handler = require("./requestHandler");

module.exports.route = function (request, response) {
    var pathName = url.parse(request.url).pathname;
    handler.handle(pathName, request, response);
};