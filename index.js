require('dotenv').config();
const express = require("express");
const process = require('process');
const { exec } = require("child_process");
var Twit = require('twit');
const fs = require('fs')
const app = express();
const port = process.env.PORT || 3000;

//Middlewares
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

//HomePage
app.get("/", (req, res) => {
  res.setHeader('Content-type', 'text/html');
  res.send("<h1>Hello<h1>");
})

//Triggered when the user sends the company name from whatsapp
app.post("/receive", (req, res) => {

  var company_name = req.body.Body;
  var message = "";
  var counter = 0;

  // It restarts the server that was closed after the messasge was sent to whatsapp.
  // This is done to make the communication better. Howerver, this creates an issue when
  // when the first post request is made because the server was on at that time. Although, 
  // it does not create any issue in our overall code execution, we are still trying to 
  // find out the solution to make this better.
  exec("nodemon index.js", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });

  // Empty the file
  fs.truncate('test.txt', 0, function () { console.log('done') });

  //Fetch the follwers of the specified company
  T.get('friends/list', { screen_name: company_name }, async function getData(err, data, response) {
    data.users.map((user) => {
      if (user.description.includes(company_name) || user.description.includes("@" + company_name)) {
        message += "@" + user.screen_name + "\n";
        fs.appendFile('test.txt', "@" + user.screen_name + "\n", err => {
          if (err) {
            console.error(err)
          }
          //file written successfully
        })
      }
    })
    if (data['next_cursor'] > 0) T.get('friends/list', { screen_name: company_name, cursor: data['next_cursor'] }, getData);
    else {
      const path = './test.txt'
      try {
        fs.unlinkSync(path);
        //file removed
      } catch (err) {
        console.error(err)
      }
      const twiml = new MessagingResponse();
      twiml.message(`${message}` + "Now Please make another request after 15-20 minutes in order to get fruitful results");
      counter = 1;
      res.status(200).contentType("text/xml").end(twiml.toString());
      server.close((err) => {
        console.log('server closed')
        process.exit(err ? 1 : 0)
      })
    }
  })

  // This is just a hack. When the twitter api rate limit is reached the execution
  // reaches here and sends whatever information it has captured till now to whatsapp.
  process.on('unhandledRejection', (error) => {
    if (fs.existsSync('test.txt')) {
      const data = fs.readFileSync('test.txt', 'utf8')
      console.log(data)
      const path = './test.txt'
      try {
        fs.unlinkSync(path)
        //file removed
      } catch (err) {
        throw new Error(err);
      }
      const twiml = new MessagingResponse();
      twiml.message(`${data}` + "Now Please make another request after 15-20 minutes in order to get fruitful results");
      res.status(201).contentType("text/xml").end(twiml.toString());
      server.close((err) => {
        console.log('server closed')
        process.exit(err ? 1 : 0)
      })
    } else if (!fs.existsSync('test.txt') && counter != 1) {
      const twiml = new MessagingResponse();
      twiml.message("Twitter API Rate limit Exceeded. Try after 10-15 minutes");
      server.close((err) => {
        console.log('server closed')
        process.exit(err ? 1 : 0)
      })
      res.status(201).contentType("text/xml").end(twiml.toString());
      server.close((err) => {
        console.log('server closed')
        process.exit(err ? 1 : 0)
      })
    }
  });
})

const server = app.listen(port, () => console.log(`Server started listening at port ${port}`));
