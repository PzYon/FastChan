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
                var rems = 0.9;
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

                scope.aceChanged = function (x) {
                    scope.messageEditor.newMessage.text = x[1].getValue();

                    var lineCount = aceEditor.session.getLength();
                    var magicalFactor = rems * 1.2;

                    // todo: i'm trying to get ace-container
                    // because i failed miserably, i'm using this ugly piece of shit - jQuery-style!
                    var magicElement = angular.element(elem.children()[0]);
                    magicElement.css({"height": (lineCount * magicalFactor) + "rem"});
                };

                scope.changeAceMode = function () {
                    aceEditor.session.setMode("ace/mode/" + scope.messageEditor.newMessage.language);
                };
            }
        };
    }]);

    app.directive("messageViewer", function () {
        return {
            scope: {
                messageViewer: "="
            },
            restrict: "A",
            templateUrl: "partials/directives/messageViewer.html",
            link: function (scope, element) {
                var rems = 0.9;
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
                        fontSize: rems + "rem",
                        mode: "ace/mode/" + message.language
                    });

                    editor.setValue(scope.messageViewer.text);
                    editor.clearSelection();

                    var lineCount = editor.session.getLength();
                    var magicalFactor = rems * 1.2;
                    element.css({"height": (lineCount * magicalFactor) + "rem"});
                };
            }
        };
    });
}(fastChanApp));