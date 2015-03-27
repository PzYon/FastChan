"use strict";

var http = require("http");
var path = require("path");
var fs = require("fs");

var io = require("socket.io");
var SocketIOFileUpload = require("socketio-file-upload");

var config = require("./config");
var channels = require("./channels");
var socketManager = require("./socketManager");

function onSocketConnection(socket) {
    socket.on(config.events.updateUserInfo, function (userName) {
        socketManager.add(socket, userName);
    });

    socket.join(config.defaultRoomId);

    socket.emit(config.events.initialize, channels.getAll());

    socket.on(config.events.updateChannel, function (channel) {
        channels.updateChannel(channel);
        socketManager.sendBroadcastIncludingSelf(socket, config.events.updateChannel, channel);
    });

    socket.on(config.events.addMessageToChannel, function (message) {
        var author = socketManager.getUserNameForSocket(socket);
        // todo: pass message object instead of separate parameters
        var channel = channels.addMessageToChannel(message.channelId, message.text, author, message.isCode, message.language);
        if (channel) {
            socketManager.sendBroadcastIncludingSelf(socket, config.events.updateChannel, channel);
        }
    });

    socket.on(config.events.disconnect, function () {
        socketManager.remove(socket);
    });

    socketManager.add(socket);

    registerFileUploader(socket);
}

function registerFileUploader(socket) {
    var uploader = new SocketIOFileUpload();
    uploader.listen(socket);

    uploader.on(config.fileUpload.events.start, function (event) {
        var channelId = event.file.meta[config.fileUpload.channelId];
        var targetDir = path.join(config.paths.absoluteApplicationRoot, config.paths.channels, channelId);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir);
        }

        uploader.dir = targetDir;
    });

    uploader.on(config.fileUpload.events.saved, function (event) {
        var channelId = event.file.meta[config.fileUpload.channelId];
        var fileName = path.basename(event.file.pathName);
        var channel = channels.addFile(channelId, fileName, socketManager.getUserNameForSocket(socket));

        socketManager.sendBroadcastIncludingSelf(socket, config.events.updateChannel, channel);
    });

    uploader.on(config.fileUpload.events.error, function (e) {
        socketManager.sendStatusSelf("Couldn't upload file: " + e);
    });
}

module.exports.start = function (route, port) {
    var server = http.createServer(route);

    // listen for http-requests on specified port
    server.listen(port);

    // list for web-sockets
    io.listen(server).on(config.events.connect, onSocketConnection);
};