"use strict";

var path = require("path");
var fs = require("fs");

var _ = require("underscore");

var config = require("./config");

function getContentType(pathName) {
    var extension = path.extname(pathName).split("?")[0];
    switch (extension) {
    case ".js":
        return "application/javascript";
    case ".css":
        return "text/css";
    case ".html":
        return "text/html";
    case ".jpg":
        return "image/jpeg";
    case ".gif":
        return "image/gif";
    case ".png":
        return "image/png";
    default:
        return "text/plain";
    }
}

function isHttpFolder(pathName) {
    var firstSegment = pathName.split("/")[1];
    return _.contains(config.httpFolders, firstSegment);
}

function getFilePath(pathName) {
    var rootFolder = isHttpFolder(pathName) ? ".." : "../client";
    return path.join(__dirname, rootFolder, pathName);
}

function handleConfig(pathName, response) {
    if (pathName.indexOf(config.urls.config) === 0) {
        var segments = pathName.split("/");
        if (segments.length > 2) {
            response.writeHead(200, {"Content-Type": "text/javascript"});
            response.write(segments[2] + ".constant('config', " + JSON.stringify(config) + ");");
            response.end();
            return true;
        }
    }
    return false;
}

module.exports.handle = function (pathName, request, response) {
    if (handleConfig(pathName, response)) {
        return;
    }

    if (pathName === "/") {
        pathName = config.urls.index;
    }

    fs.readFile(getFilePath(pathName), "binary", function (errorMessage, file) {
        if (errorMessage) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write("Cannot open URL '" + request.url + "'\n\n" + errorMessage + "\n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": getContentType(pathName)});
            response.write(file, "binary");
            response.end();
        }
    });
};