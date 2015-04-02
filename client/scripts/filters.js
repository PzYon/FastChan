(function (app) {
    "use strict";

    app.filter("literalDate", ["$filter", function ($filter) {
        function getOffsetDate(offset) {
            if (typeof offset === "string") {
                switch (offset) {
                case "today":
                    return Date.today();
                case "yesterday":
                    return Date.yesterday();
                }
            }

            if (offset) {
                return new Date().remove(offset);
            }

            return null;
        }

        function formatDate(dateValue, definition) {
            var segments = [];

            if (definition.prefix) {
                segments.push(definition.prefix);
            }

            if (definition.format) {
                segments.push($filter("date")(dateValue, definition.format));
            }

            return segments.join(" ");
        }

        return function (dateString, definitions, fallback) {
            var timestamp = Date.parse(dateString);
            if (isNaN(timestamp)) {
                return fallback || "";
            }

            var dateValue = new Date(timestamp);
            for (var i = 0; i < definitions.length; i++) {
                var definition = definitions[i];
                if (!definition.offset) {
                    return formatDate(dateValue, definition);
                }

                var offsetDate = getOffsetDate(definition.offset);

                // -1 if date1 is smaller, 0 if equal, 1 if date2 is smaller
                if (Date.compare(offsetDate, dateValue) === -1) {
                    return formatDate(dateValue, definition);
                }
            }

            return dateValue;
        };
    }]);
}(fastChanApp));