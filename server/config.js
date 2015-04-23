"use strict";

module.exports = {
    port: 1337,
    appName: "FastChan",
    defaultRoomId: "DefaultRoom",
    imageFormats: [".jpg", ".jpeg", ".png", ".gif"],
    httpFolders: ["channels"],
    paths: {
        channels: "../channels",
        absoluteApplicationRoot: __dirname
    },
    urls: {
        index: "/index.html",
        config: "/config"
    },
    events: {
        initialize: "initialize",
        connect: "connect",
        disconnect: "disconnect",
        addMessageToChannel: "addMessageToChannel",
        deleteChannel: "deleteChannel",
        updateChannel: "updateChannel",
        updateSessionInfo: "updateSessionInfo",
        updateUserInfo: "updateUserInfo",
        updateStatus: "updateStatus"
    },
    fileUpload: {
        channelId: "channelId",
        events: {
            start: "start",
            saved: "saved",
            complete: "complete",
            error: "error"
        }
    },
    gui: {
        messages: {
            lineHeight: 0.95,
            supportedLanguages: [
                "html",
                "css",
                "javascript",
                "json",
                "csharp"
            ]
        },
        dateFormats: {
            status: "dd.MM.yy @ HH:mm:ss",
            messageTooltip: "dd.MM.yy @ HH:mm:ss",
            message: [
                {
                    offset: {minutes: 2},
                    prefix: "just now"
                },
                {
                    offset: {minutes: 10},
                    prefix: "some minutes ago"
                },
                {
                    offset: "today",
                    format: "HH:mm"
                },
                {
                    offset: "yesterday",
                    format: "HH:mm",
                    prefix: "yesterday,"
                },
                {
                    offset: {days: 7},
                    format: "EEEE, HH:mm"
                },
                {
                    format: "dd.MM.yy"
                }
            ]
        }
    }
};