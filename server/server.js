require('dotenv').config();
const express = require('express');
const cors = require('cors');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const { OpenAI } = require('openai');
const { Vonage } = require("@vonage/server-sdk");
const app = express();
const fs = require('fs');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });


// This callback function is called every time a new client connects
wss.on('connection', function connection(ws) {
  console.log('A new client connected.');

  // Here, 'ws' represents the WebSocket connection to a single client
  ws.on('message', function incoming(message, isBinary) {
      if (isBinary) {
          console.log('Binary data received');
          // You can handle binary data here
      } else {
          console.log("text data received")
      }
  });

  // Optionally, handle close events
  ws.on('close', function close() {
      console.log('Client disconnected.');
  });
});

console.log('WebSocket server is running on port 8080.');

app.use(cors());
app.use(express.json());

const privateKey = fs.readFileSync(process.env.VONAGE_APPLICATION_PRIVATE_KEY_PATH, 'utf8');

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
  applicationId: process.env.VONAGE_APPLICATION_ID,
  privateKey: privateKey,
});


app.post('/api/make-call', (req, res) => {


  vonage.voice.createOutboundCall({
      to: [{ type: 'phone', number: "13038815725" }], // Now dynamically using the userNumber
      from: { type: 'phone', number: "16503311418" },
      ncco: [{
          action: 'talk',
          text: 'Connecting you to a live session.'
      }, {
          action: 'connect',
          endpoint: [{
              type: 'websocket',
              uri: 'wss://a4dd-2601-283-5002-eda0-1d5c-85b0-6f12-2d24.ngrok-free.app/socket',
              "content-type": 'audio/l16;rate=16000',
              headers: {
                  'Conversation-ID': 'unique-conversation-id'
              }
          }]
      }]
  }, (error, response) => {
      if (error) {
          console.error(error);
          return res.status(500).send(error);
      }
      res.send({ message: 'Call initiated successfully', data: response });
  });
});



app.post('/api/end-call', (req, res) => {
  const { uuid } = req.body; // You need the UUID of the call to terminate it

  vonage.calls.update(uuid, { action: 'hangup' }, (error, response) => {
      if (error) {
          console.error(error);
          res.status(500).send({ message: 'Failed to end the call', error: error });
      } else {
          res.send({ message: 'Call ended successfully' });
      }
  });
});




const sendinblueClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = sendinblueClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;


const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

app.post('/api/send-email', (req, res) => {
  const { email, message } = req.body;


  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = { "name": "User", "email": process.env.SENDINBLUE_EMAIL }; // Use a general sender email you've verified with Sendinblue
  sendSmtpEmail.to = [{ "email": process.env.EMAIL_ADDRESS }]; // Your personal email
  sendSmtpEmail.subject = "New Message from Your Crush";
  sendSmtpEmail.textContent = `Message from: ${email}\n\n${message}`; // Include the sender's email in the message body


  transactionalEmailsApi.sendTransacEmail(sendSmtpEmail).then(function(data) {
    console.log('API called successfully. Returned data: ' + data);
    res.status(200).send('Email sent successfully');
  }, function(error) {
    console.error(error);
    res.status(500).send('Failed to send email');
  });
});


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

app.post('/generate-response', async (req, res) => {
  const { userInput } = req.body;
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: " You are a girl in your late teens, around 19 years old, named Ashley. You are knowledgeable about your own life experiences, preferences, hobbies, and you have a casual and upbeat way of speaking. You should only respond to questions about yourself and avoid answering general knowledge questions or performing tasks like an AI assistant. You also occasiionally use text abbreviations such as lol if things are funny or haha if things are funny. If you want to shorten because you type bc. If something shocks you or if something sounds crazy, you say things like omg or bruh. You don't greet me with every response, just initially at the start of the conversation." },
        { role: "user", content: userInput }
      ],
    });

    const messageContent = response.choices[0].message.content.trim();

    res.json({ aiResponse: messageContent });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).send(`Error generating AI response: ${error.message}`);
  }
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
