var gulp = require("gulp");

var bowerDir = "./bower_components/";
var clientScriptDir = "./client/scripts/packages/";

gulp.task("default", function() {
	gulp.start("copyPackages");
});

gulp.task("copyPackages", function(){
	gulp.src(bowerDir + "angular/angular.js").pipe(gulp.dest(clientScriptDir + "angular"));
	gulp.src(bowerDir + "angular-route/angular-route.js").pipe(gulp.dest(clientScriptDir + "angular-route"));
	gulp.src(bowerDir + "angular-ui-ace/ui-ace.js").pipe(gulp.dest(clientScriptDir + "angular-ui-ace"));
	gulp.src(bowerDir + "underscore/underscore.js").pipe(gulp.dest(clientScriptDir + "underscore"));
	gulp.src(bowerDir + "socket.io-client/socket.io.js").pipe(gulp.dest(clientScriptDir + "socket.io-client"));
	gulp.src(bowerDir + "socketio-file-upload/client.js").pipe(gulp.dest(clientScriptDir + "socketio-file-upload"));
	gulp.src(bowerDir + "ace-builds/src/ace.js").pipe(gulp.dest(clientScriptDir + "ace"));
	gulp.src(bowerDir + "ace-builds/src/*json.js").pipe(gulp.dest(clientScriptDir + "ace"));
	gulp.src(bowerDir + "ace-builds/src/*javascript.js").pipe(gulp.dest(clientScriptDir + "ace"));
	gulp.src(bowerDir + "ace-builds/src/*csharp.js").pipe(gulp.dest(clientScriptDir + "ace"));
	gulp.src(bowerDir + "ace-builds/src/*html.js").pipe(gulp.dest(clientScriptDir + "ace"));
	gulp.src(bowerDir + "ace-builds/src/*css.js").pipe(gulp.dest(clientScriptDir + "ace"));
});