/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at 
 * githubLink
 **/

'use strict';
const Alexa = require('alexa-sdk');
const https = require("https");

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

const SKILL_NAME = 'Rail Info';
const HELP_MESSAGE = 'You can say tell me the cancelled or rescheduled trains, or, you can say stop... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';
const GREETMSG = 'Hello, Would you like to know the cancelled trains, rescheduled trains or PNR status';
const REPROMPTMSG = 'Would you like to hear some other info ?';

const shortCodes = {
    "GNWL": "General Waiting List",
    "RLWL": "Remote Location Waiting List",
    "PQWL": "Pooled Quota Waiting List",
    "RLGN": "Remote Location General Waiting List",
    "RSWL": "Roadside Station Waiting List",
    "RQWL": "Request Waiting List",
    "TQWL": "Tatkal Waiting List",
    "CKWL": "Tatkal Waiting List",
    "RAC": "Reservation Against Cancellation",
    "CNF": "Confirmed"
};

const shtName = {
    "SL": "Sleeper class",
    "CC": "AC Chair Car",
    "2S": "Seater Class",
    "1A": "AC First Class",
    "2A": "AC Second Class",
    "3A": "AC Third Class"
};

//=============================================================
//Editing anything below this line might break your skill.
//=============================================================

const handlers = {
    'LaunchRequest': function () {
        this.emit('GreetUser');
    },
    'GreetUser': function () {
        this.response.cardRenderer(SKILL_NAME, GREETMSG);
        this.response.speak(GREETMSG).listen(GREETMSG);
        this.emit(':responseReady');
    },
    'GetRailCancelledIntent': function () {
        https.get('https://valerianpereira.in/api/railinfo/?action=cancel', res => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", data => {
                body += data;
            });
            res.on("end", () => {
                body = JSON.parse(body);
                let speechOutput = 'Total ' + body.trains.length + ' trains cancelled. Here is the info for 1st 5 from the list. ';
                let stmt = '';
                let cardInfo = speechOutput + "\n\n";
                let count = 0;

                body.trains.map(objj => {
                    if (count < 5) {
                        stmt = "Train " + objj.name + " bearing number " + objj.number + " departing on " + objj.start_time + " from " + objj.source.name + " to " + objj.dest.name + " is cancelled. ";
                        speechOutput = speechOutput + stmt;
                        cardInfo += stmt + "\n\n";
                    }
                    count++;
                });
                this.response.cardRenderer(SKILL_NAME + 'Cancelled Trains List', cardInfo);
                this.response.speak(speechOutput);
                this.emit(':responseReady');
            });
        });
    },
    'GetRailPNRIntent': function () {
        const varrNa = this.event.request.intent.slots.pnr.value;
        if (isNaN(this.event.request.intent.slots.pnr.value) || this.event.request.intent.slots.pnr.value.length != 10) {
            this.response.cardRenderer(SKILL_NAME, "Invalid PNR Number");
            this.response.speak("Invalid PNR Number");
            this.emit(':responseReady');
        } else {
            let speechOutput = "";

            https.get('https://valerianpereira.in/api/railinfo/?action=pnrinfo&pnrno=' + varrNa, res => {
                res.setEncoding("utf8");
                let body = "";
                let cardInfo = "";
                let stmmt = "";
                res.on("data", data => {
                    body += data;
                });
                res.on("end", () => {
                    body = JSON.parse(body);
                    
                    //if (body.response_code === 220) {
                    if (body.train.number == null) {
                        speechOutput = 'Could not find info for the PNR Number ';
                        cardInfo = 'Could not find info for the PNR Number ';
                    } else {
                        speechOutput = speechOutput + 'Info for PNR number ' + body.pnr + " for the train " + body.train.name + " bearing number " + body.train.number + " boarding from " + body.boarding_point.name + " with coach type " + shtName[body.journey_class.code] + " for " + body.passengers.length + " passengers is a follows. ";
                        cardInfo = speechOutput + "\n\n";

                        body.passengers.map(passGr => {
                            let spltStat = passGr.current_status.split("/");
                            //stmmt = "Passenger Number " + passGr.no + " with status as " + spltStat[1] + " in " + shortCodes[spltStat[0]] + ". ";
                            stmmt = "Passenger Number " + passGr.no + " seat is " + shortCodes[spltStat[0]] + ". ";
                            speechOutput = speechOutput + stmmt;
                            cardInfo += stmmt + "\n\n";
                        });
                    }
                    
                    this.response.cardRenderer(SKILL_NAME + 'PNR Status Info', cardInfo);
                    this.response.speak(speechOutput);
                    this.emit(':responseReady');
                });
            });
        }
    },
    'GetRailRescheduledIntent': function () {
        https.get('https://valerianpereira.in/api/railinfo/?action=reschedule', res => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", data => {
                body += data;
            });
            res.on("end", () => {
                body = JSON.parse(body);
                let speechOutput = 'Total ' + body.trains.length + ' trains rescheduled. Here is the 1st 5 from the list. ';
                let cardInfo = speechOutput + "\n\n";
                let stmt = '';
                let count = 0;

                body.trains.map(objj => {
                    if (count < 5) {
                        stmt = "Train " + objj.name + " bearing number " + objj.number + " departing from " + objj.from_station.name + " to " + objj.to_station.name + " is rescheduled on " + objj.rescheduled_date + " at " + objj.rescheduled_time + " hours. Delay of " + objj.time_diff + " hours. ";
                        speechOutput = speechOutput + stmt;
                        cardInfo += stmt + "\n\n";
                    }
                    count++;
                });
                this.response.cardRenderer(SKILL_NAME + 'Rescheduled Trains List', cardInfo);
                this.response.speak(speechOutput);
                this.emit(':responseReady');
            });
        });
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'EndSessionIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
