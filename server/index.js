"use strict";

var server = require("./server");
var router = require("./router");
var config = require("./config");

server.start(router.route, config.port);

console.log("Server is listening on port '" + config.port + "'");