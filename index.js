require('dotenv').config();
const express = require("express");
var Twit = require('twit');
const app = express();
const port = process.env.PORT || 3000;

//express.json() --> It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Secret values for twitter api and twilio
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);

//Twit setup for nodejs
var T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const MessagingResponse = require("twilio").twiml.MessagingResponse;


