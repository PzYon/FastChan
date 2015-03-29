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
            lineHeight: 0.9,
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
            message: "EEE, HH:mm"
        }
    }
};