"use strict";

var path = require("path");

var uuid = require("node-uuid");
var _ = require("underscore");

var config = require("./config");
var testData = require("./testData");

var allChannels = testData.getData(50, 50);

function setLastModified(channel, date) {
    if (channel) {
        channel.lastModified = date || new Date();
    }
    return channel;
}

module.exports.getAll = function () {
    return allChannels;
};

module.exports.getById = function (id) {
    return _.findWhere(allChannels, {id: id});
};

module.exports.replace = function (oldChannel, newChannel) {
    allChannels[allChannels.indexOf(oldChannel)] = newChannel;
};

module.exports.updateChannel = function (channel) {
    if (!channel) {
        return;
    }

    channel = setLastModified(channel);

    var existingChannel = module.exports.getById(channel.id);
    if (existingChannel) {
        module.exports.replace(existingChannel, channel);
    } else {
        channel.id = uuid.v4();
        allChannels.push(channel);
    }
};

module.exports.deleteChannel = function (channel) {
    if (!channel) {
        return;
    }

    var existingChannel = module.exports.getById(channel.id);
    if (!existingChannel) {
        return;
    }

    allChannels.splice(allChannels.indexOf(existingChannel), 1);

    // do we need to delete stuff from file system as well?
};

module.exports.addFile = function (channelId, fileName, userName) {
    var url = "/channels/" + channelId + "/" + fileName;
    var channel = module.exports.getById(channelId);

    if (!channel.files) {
        channel.files = [];
    }

    channel.files.push({
        name: fileName,
        url: url,
        isImage: config.imageFormats.indexOf(path.extname(fileName).toLowerCase()) > -1,
        addedBy: userName,
        date: new Date()
    });

    // there's no need to update the lastModified date here,
    // as this is done in the addMessageToChannel function

    channel = module.exports.addMessageToChannel({
        channelId: channel.id,
        text: "{added file " + fileName + "}",
        userName: userName
    });

    return channel;
};

module.exports.addMessageToChannel = function (message) {
    var channel = module.exports.getById(message.channelId);
    if (!channel) {
        return;
    }

    if (!channel.messages) {
        channel.messages = [];
    }

    var now = new Date();

    message.date = now;
    channel = setLastModified(channel, now);

    channel.messages.push(message);

    return channel;
};