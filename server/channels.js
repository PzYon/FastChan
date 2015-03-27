"use strict";

var path = require("path");

var uuid = require("node-uuid");
var _ = require("underscore");

var config = require("./config");

var allChannels = [
    {
        id: uuid.v4(),
        name: "A first channel",
        messages: [
            {
                date: new Date(),
                userName: "alpha",
                text: "Some content text.."
            }
        ]
    },
    {
        id: uuid.v4(),
        name: "Another channel",
        messages: [
            {
                date: new Date(),
                userName: "alpha",
                text: "Some content text.."
            },
            {
                date: new Date(),
                userName: "B3ta",
                text: "Additional content text.."
            }
        ]
    }
];

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

    var existingChannel = module.exports.getById(channel.id);
    if (existingChannel) {
        module.exports.replace(existingChannel, channel);
    } else {
        channel.id = uuid.v4();
        allChannels.push(channel);
    }
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

    channel = module.exports.addMessageToChannel(channel.id, "{added file " + fileName + "}", userName);

    return channel;
};

module.exports.addMessageToChannel = function (channelId, text, userName, isCode, language) {
    var channel = module.exports.getById(channelId);
    if (!channel) {
        return;
    }

    if (!channel.messages) {
        channel.messages = [];
    }

    channel.messages.push({
        date: new Date(),
        userName: userName,
        text: text,
        isCode: isCode,
        language: language
    });

    return channel;
};