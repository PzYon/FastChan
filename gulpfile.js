// todos / nice to haves:
// - bundle app-scripts
// - minify
// - create different configuration for prod and dev
// - register in WS: https://www.jetbrains.com/webstorm/help/run-debug-configuration-gulp-js.html

var gulp = require("gulp");
var clean = require('gulp-clean');
var concat = require('gulp-concat');

var bowerDir = "./bower_components/";
var clientLibsDir = "./client/scripts/libs/";

gulp.task("default", function () {
    gulp.start("copyLibs");
});

gulp.task("cleanLibs", function () {
    return gulp.src(clientLibsDir, {read: false}).pipe(clean());
});

gulp.task("copyLibs", ["cleanLibs"], function () {
    gulp.src([
        bowerDir + "date-utils/lib/date-utils.js",
        bowerDir + "angular/angular.js",
        bowerDir + "angular-route/angular-route.js",
        bowerDir + "underscore/underscore.js",
        bowerDir + "socket.io-client/socket.io.js",
        bowerDir + "socketio-file-upload/client.js"
    ]).pipe(concat("packaged.js")).pipe(gulp.dest(clientLibsDir));

    // we do not package ace and related js-files, as otherwise we get issues
    // regarding the basePath etc., when ace tries to dynamically load
    // modes and workers from the (wrong) implicit path
    gulp.src(bowerDir + "angular-ui-ace/ui-ace.js").pipe(gulp.dest(clientLibsDir + "ui-ace"));
    gulp.src(bowerDir + "ace-builds/src/ace.js").pipe(gulp.dest(clientLibsDir + "ace"));

    gulp.src(bowerDir + "ace-builds/src/*json.js").pipe(gulp.dest(clientLibsDir + "ace"));
    gulp.src(bowerDir + "ace-builds/src/*javascript.js").pipe(gulp.dest(clientLibsDir + "ace"));
    gulp.src(bowerDir + "ace-builds/src/*csharp.js").pipe(gulp.dest(clientLibsDir + "ace"));
    gulp.src(bowerDir + "ace-builds/src/*html.js").pipe(gulp.dest(clientLibsDir + "ace"));
    gulp.src(bowerDir + "ace-builds/src/*css.js").pipe(gulp.dest(clientLibsDir + "ace"));
});