(function (app) {
    "use strict";

    app.directive("messageEditor", ["config", function (config) {
        return {
            restrict: "A",
            scope: {
                messageEditor: "="
            },
            templateUrl: "partials/directives/messageEditor.html",
            link: function (scope, element) {
                var elem = element;
                var aceEditor;

                if (!scope.messageEditor.newMessage) {
                    scope.messageEditor.newMessage = {};
                }

                scope.config = config;

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
            link: function (scope, element) {
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
}(fastChanApp));