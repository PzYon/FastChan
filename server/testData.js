var uuid = require("node-uuid");
var dateUtils = require('date-utils');

var userA = "ctor";
var userB = "C0nS0l3";
var userC = "Lonely";

module.exports.channels = [
    {
        id: uuid.v4(),
        name: "C# Channel",
        messages: [
            {
                date: new Date().remove({days: 1}),
                userName: userA,
                text: "I'm a big fan of MicroSoft and .NET.."
            },
            {
                date: new Date().remove({hours: 2}),
                userName: userB,
                text: "Hmm, I prefer JS!"
            },
            {
                date: new Date().remove({minutes: 15}),
                userName: userA,
                text: "Yeah, JavaScript is cool too, but typed-languages are more comfortable.."
            },
            {
                date: new Date().remove({minutes: 5}),
                userName: userA,
                text: "And have you tried the new Web API stuff? It works great with frameworks like AngularJS or something."
            },
            {
                date: new Date(),
                userName: userA,
                text: "No, maybe I should try that out.."
            }
        ]
    },
    {
        id: uuid.v4(),
        name: "JavaScript Channel",
        messages: [
            {
                date: new Date().remove({hours: 1}),
                userName: userB,
                text: "I think JavaScript is really great. Let me show you a sample:"
            },
            {
                date: new Date().remove({minutes: 35}),
                userName: userB,
                text: "function testFunction(value) {\n   console.log('value is', value);\n}",
                isCode: true,
                language: "javascript"
            }
        ]
    },
    {
        id: uuid.v4(),
        name: "PHP Channel",
        messages: [
            {
                date: new Date().remove({months: 1}),
                userName: userC,
                text: "Why is it so quite here?"
            },
            {
                date: new Date().remove({days: 12, hours: 11}),
                userName: userC,
                text: "And why is there no support for PHP in the code editor?"
            },
            {
                date: new Date().remove({days: 4, hours: 2}),
                userName: userC,
                text: "Helloooooo!?"
            },
            {
                date: new Date().remove({days: 12, hours: 10}),
                userName: userB,
                text: "R u really asking y?"
            }
        ]
    }
];