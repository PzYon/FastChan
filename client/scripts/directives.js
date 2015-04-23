(function (app) {
    "use strict";

    app.directive("messageEditor", ["config", function (config) {
        return {
            restrict: "A",
            scope: {
                messageEditor: "="
            },
            templateUrl: "partials/directives/messageEditor.html",
            link: function (scope) {
                var aceEditor;

                scope.config = config;

                if (!scope.messageEditor) {
                    // we are too early, nothing to do yet.. maybe the routing change (to the current channel)
                    // is too late and should somehow be done earlier [$location.url()]
                    return;
                }

                if (!scope.messageEditor.newMessage) {
                    scope.messageEditor.newMessage = {};
                }

                scope.commitMessage = function () {
                    scope.$parent.channels.commitMessage();
                    scope.editorHeight = 0;
                };

                scope.aceLoaded = function (editor) {
                    aceEditor = editor;

                    if (!scope.messageEditor.newMessage.language) {
                        scope.messageEditor.newMessage.language = "javascript";
                    }

                    aceEditor.setOptions({
                        showPrintMargin: false
                    });

                    scope.changeAceMode();
                    aceEditor.setValue(scope.messageEditor.newMessage.text);
                    aceEditor.clearSelection();
                };

                scope.aceChanged = function (args) {
                    scope.messageEditor.newMessage.text = args[1].getValue();

                    var lineCount = aceEditor.session.getLength();
                    scope.editorHeight = lineCount * config.gui.messages.lineHeight;
                };

                scope.changeAceMode = function () {
                    aceEditor.session.setMode("ace/mode/" + scope.messageEditor.newMessage.language);
                };
            }
        };
    }]);

    app.directive("messageViewer", ["config", function (config) {
        return {
            scope: {
                messageViewer: "="
            },
            restrict: "A",
            templateUrl: "partials/directives/messageViewer.html",
            link: function (scope) {
                var message = scope.messageViewer;

                if (!message.isCode) {
                    return;
                }

                scope.aceLoaded = function (editor) {
                    // configuration: https://github.com/ajaxorg/ace/wiki/Configuring-Ace
                    // api: http://ace.c9.io/#nav=api
                    editor.setOptions({
                        showPrintMargin: false,
                        showLineNumbers: false,
                        showGutter: false,
                        highlightActiveLine: false,
                        readOnly: true,
                        mode: "ace/mode/" + message.language
                    });

                    editor.setValue(scope.messageViewer.text);
                    editor.clearSelection();

                    var lineCount = editor.session.getLength();
                    scope.editorHeight = lineCount * config.gui.messages.lineHeight;
                };
            }
        };
    }]);

    app.directive("fileDropper", ["socketService", function (socketService) {
        function bindChannel(scope) {
            scope.channel = scope.fileDropper;
        }

        return {
            restrict: "A",
            scope: {
                fileDropper: "="
            },
            templateUrl: "partials/directives/fileDropper.html",
            link: function (scope, element) {
                scope.$watch("fileDropper", function () {
                    bindChannel(scope);
                    socketService.ensureFileUpload(scope.channel.id, element);
                });

                scope.$on("$destroy", function () {
                    socketService.removeFileUpload(element);
                });
            }
        };
    }]);
}(fastChanApp));