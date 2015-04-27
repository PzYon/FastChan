(function (app) {
    "use strict";

    app.directive("messageEditor", ["config", function (config) {

        function link(scope) {

            function ensureNewMessage() {
                if (scope.channel && !scope.channel.newMessage) {
                    scope.channel.newMessage = {};
                }
            }

            var aceEditor;

            scope.config = config;

            scope.commitMessage = function () {
                scope.onSubmit({channel: scope.channel});
                scope.editorHeight = 0;
            };

            scope.aceLoaded = function (editor) {
                aceEditor = editor;

                ensureNewMessage()

                if (!scope.channel.newMessage.language) {
                    scope.channel.newMessage.language = "javascript";
                }

                aceEditor.setOptions({
                    showPrintMargin: false
                });

                scope.changeAceMode();
                aceEditor.setValue(scope.channel.newMessage.text);
                aceEditor.clearSelection();
            };

            scope.aceChanged = function (args) {
                ensureNewMessage();

                scope.channel.newMessage.text = args[1].getValue();

                var lineCount = aceEditor.session.getLength();
                scope.editorHeight = lineCount * config.gui.messages.lineHeight;
            };

            scope.changeAceMode = function () {
                aceEditor.session.setMode("ace/mode/" + scope.channel.newMessage.language);
            };
        }

        return {
            restrict: "A",
            scope: {
                channel: "=messageEditor",
                onSubmit: "&"
            },
            templateUrl: "partials/directives/messageEditor.html",
            link: link
        };
    }]);

    app.directive("messageViewer", ["config", function (config) {

        function link(scope) {
            if (!scope.message.isCode) {
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
                    mode: "ace/mode/" + scope.message.language
                });

                editor.setValue(scope.message.text);
                editor.clearSelection();

                var lineCount = editor.session.getLength();
                scope.editorHeight = lineCount * config.gui.messages.lineHeight;
            };
        }

        return {
            scope: {
                message: "=messageViewer"
            },
            restrict: "A",
            templateUrl: "partials/directives/messageViewer.html",
            link: link
        };

    }]);

    app.directive("fileDropper", ["socketService", function (socketService) {

        return {
            restrict: "A",
            scope: {
                channel: "=fileDropper"
            },
            templateUrl: "partials/directives/fileDropper.html",
            link: function (scope, element) {
                scope.$watch("channel", function () {
                    socketService.ensureFileUpload(scope.channel.id, element);
                });

                scope.$on("$destroy", function () {
                    socketService.removeFileUpload(element);
                });
            }
        };

    }]);
    
}(fastChanApp));