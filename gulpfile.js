// todo:
// - bundle app-scripts
// - minify
// - create different configuration for prod and dev
// - register in WS: https://www.jetbrains.com/webstorm/help/run-debug-configuration-gulp-js.html

var gulp = require("gulp");
var concat = require('gulp-concat');

var bowerDir = "./bower_components/";
var clientScriptDir = "./client/scripts/libs/";

gulp.task("default", function () {
    gulp.start("copyPackages");
});

gulp.task("copyPackages", function () {
    gulp.src([
        bowerDir + "angular/angular.js",
        bowerDir + "angular-route/angular-route.js",
        bowerDir + "angular-ui-ace/ui-ace.js",
        bowerDir + "underscore/underscore.js",
        bowerDir + "socket.io-client/socket.io.js",
        bowerDir + "socketio-file-upload/client.js",
        bowerDir + "ace-builds/src/ace.js",
        bowerDir + "ace-builds/src/*json.js",
        bowerDir + "ace-builds/src/*javascript.js",
        bowerDir + "ace-builds/src/*csharp.js",
        bowerDir + "ace-builds/src/*html.js",
        bowerDir + "ace-builds/src/*css.js"
    ]).pipe(concat("packaged.js")).pipe(gulp.dest(clientScriptDir));
});