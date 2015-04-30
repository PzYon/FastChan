"use strict";

var _ = require("underscore");

var config = require("./config");

var sockets = [];

function getSessionInfo() {
    return {
        socketCount: module.exports.count(),
        userCount: module.exports.countUsers()
    };
}

module.exports.add = function (socket, userName) {
    var s = _.findWhere(sockets, {id: socket.id});
    if (s) {
        s.name = userName;
    } else {
        sockets.push({id: socket.id, socket: socket, name: userName});
    }
    module.exports.sendBroadcastIncludingSelf(socket, config.events.updateSessionInfo, getSessionInfo());
};

module.exports.remove = function (socket) {
    sockets = _.without(sockets, _.findWhere(sockets, {id: socket.id}));

    module.exports.sendBroadcastIncludingSelf(socket, config.events.updateSessionInfo, getSessionInfo());
};

module.exports.count = function () {
    return sockets.length;
};

module.exports.countUsers = function () {
    var distinctUsers = [];
    for (var i = 0; i < sockets.length; i++) {
        var socket = sockets[i];
        if (distinctUsers.indexOf(socket.name) === -1) {
            distinctUsers.push(socket.name);
        }
    }
    return distinctUsers.length;
};

module.exports.getUserNameForSocket = function (socket) {
    var s = _.findWhere(sockets, {id: socket.id});
    return s ? s.name : "no name";
};

module.exports.sendSelf = function (socket, event, data) {
    socket.emit(event, data);
};

module.exports.sendBroadcast = function (socket, event, data) {
    socket.broadcast.to(config.defaultRoomId).emit(event, data);
};

module.exports.sendBroadcastIncludingSelf = function (socket, event, data) {
    module.exports.sendSelf(socket, event, data);
    module.exports.sendBroadcast(socket, event, data);
};

module.exports.sendStatusSelf = function (socket, message) {
    module.exports.sendSelf(socket, config.events.updateStatus, message);
};

module.exports.sendStatusBroadcast = function (socket, message) {
    module.exports.sendBroadcast(socket, config.events.updateStatus, message);
};

module.exports.sendStatusBroadcastIncludingSelf = function (socket, message) {
    module.exports.sendSelf(socket, config.events.updateStatus, message);
    module.exports.sendBroadcast(socket, config.events.updateStatus, message);
};
