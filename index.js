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

app.get("/", (req, res) => {
    res.setHeader('Content-type','text/html');
    res.send("<h1>Hello<h1>");
})

//Triggered when the user sends the company name from whatsapp
app.post("/receive", (req, res) => {
    var company_name = req.body.Body;
    console.log(company_name);
    var message="";
    T.get('friends/list', { screen_name: company_name }, function getData(err, data, response) {
      data.users.map((user) => {
        if (user.description.includes(company_name) || user.description.includes("@"+company_name)) {
          message+="@"+user.screen_name+"\n";
          console.log(message);
        }
      })
      if (data['next_cursor'] > 0) T.get('friends/list', { screen_name: company_name, cursor: data['next_cursor'] }, getData);
      else {
        const twiml = new MessagingResponse();
          twiml.message(`${message}`);
          res.writeHead(200, {"Content-type": "text/xml"});
          res.end(twiml.toString());
      }
  
    })
})

app.listen(port, () => console.log(`Server started listening at port ${port}`));


