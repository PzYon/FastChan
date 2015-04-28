"use strict";

var uuid = require("node-uuid");
var dateUtils = require('date-utils');

var someWords = ["Nulla", "ac", "erat", "ex", "Pellentesque", "hendrerit", "enim", "tincidunt", "nunc", "venenatis",
    "tempor", "Proin", "tristique,", "eros", "vitae", "vulputate", "congue,", "odio", "ligula",
    "hendrerit", "quam,", "condimentum", "euismod", "nibh", "orci", "rhoncus", "lacus", "Curabitur",
    "gravida", "id", "ligula", "sed", "gravida", "Sed", "vel", "pulvinar", "odio", "Nulla", "facilisi",
    "Vestibulum", "ac", "finibus", "risus", "Nullam", "aliquet", "commodo", "massa", "vitae", "congue",
    "Morbi", "eleifend", "sed", "purus", "eget", "faucibus"];

var someUsers = {
    userA: "ctor",
    userB: "C0nS0l3",
    userC: "Lonely",
    other1: "B0b Th3 Build3r",
    other2: "SpongeBob",
    other3: "Bob"
};

var channels = [
    {
        id: uuid.v4(),
        name: "C# Channel",
        lastModified: new Date(),
        messages: [
            {
                date: new Date().remove({days: 1}),
                userName: someUsers.userA,
                text: "I'm a big fan of MicroSoft and .NET.."
            },
            {
                date: new Date().remove({hours: 2}),
                userName: someUsers.userB,
                text: "Hmm, I prefer JS!"
            },
            {
                date: new Date().remove({minutes: 15}),
                userName: someUsers.userA,
                text: "Yeah, JavaScript is cool too, but typed-languages are more comfortable.."
            },
            {
                date: new Date().remove({minutes: 5}),
                userName: someUsers.userA,
                text: "And have you tried the new Web API stuff? It works great with frameworks like AngularJS or something."
            },
            {
                date: new Date(),
                userName: someUsers.userA,
                text: "No, maybe I should try that out.."
            }
        ]
    },
    {
        id: uuid.v4(),
        name: "JavaScript Channel",
        lastModified: new Date().remove({minutes: 35}),
        messages: [
            {
                date: new Date().remove({hours: 1}),
                userName: someUsers.userB,
                text: "I think JavaScript is really great. Let me show you a sample:"
            },
            {
                date: new Date().remove({minutes: 35}),
                userName: someUsers.userB,
                text: "function testFunction(value) {\n   console.log('value is', value);\n}",
                isCode: true,
                language: "javascript"
            }
        ]
    },
    {
        id: uuid.v4(),
        name: "PHP Channel",
        lastModified: new Date().remove({days: 12, hours: 10}),
        messages: [
            {
                date: new Date().remove({months: 1}),
                userName: someUsers.userC,
                text: "Why is it so quite here?"
            },
            {
                date: new Date().remove({days: 12, hours: 11}),
                userName: someUsers.userC,
                text: "And why is there no support for PHP in the code editor?"
            },
            {
                date: new Date().remove({days: 12, hours: 10}),
                userName: someUsers.userB,
                text: "R u really asking y?"
            },
            {
                date: new Date().remove({days: 4, hours: 2}),
                userName: someUsers.userC,
                text: "Helloooooo!?"
            }
        ]
    }
];

function getRandomIndex(maxLength) {
    return Math.floor(Math.random() * maxLength);
}

function getRandomTextWithLessThanNWords(n) {
    var words = [];

    for (var i = 0; i < (Math.random() * n); i++) {
        words.push(someWords[getRandomIndex(someWords.length)]);
    }

    var joined = words.join(" ");
    return joined.charAt(0).toUpperCase() + joined.slice(1);
}

function getRandomDateBeforeNDays(n, dayOffset) {
    return new Date().remove({
        days: n + (Math.random() * (dayOffset || 30)),
        hours: Math.random() * 24,
        minutes: Math.random() * 59,
        seconds: Math.random() * 59
    });
}

function getRandomUser() {
    var keys = Object.keys(someUsers);
    var key = keys[getRandomIndex(keys.length)];
    return someUsers[key];
}

function addLotsOfData(channels, numberOfChannels, numberOfMessages) {

    for (var channelIndex = 0; channelIndex < numberOfChannels; channelIndex++) {

        var lastModifiedDayOffset = Math.random() * numberOfChannels;

        var channel = {
            id: uuid.v4(),
            name: getRandomTextWithLessThanNWords(7),
            lastModified: new Date().remove({days: lastModifiedDayOffset}),
            messages: []
        };

        for (var messageIndex = 0; messageIndex < numberOfMessages; messageIndex++) {
            channel.messages.push({
                date: getRandomDateBeforeNDays(lastModifiedDayOffset),
                text: getRandomTextWithLessThanNWords(50) + "...",
                userName: getRandomUser()
            });
        }

        channels.push(channel);
    }
}

module.exports.getData = function (numberOfChannels, numberOfMessages) {
    var data = channels;

    if (numberOfChannels > 0 && numberOfMessages > 0) {
        addLotsOfData(data, numberOfChannels, numberOfMessages);
    }

    return data;
};