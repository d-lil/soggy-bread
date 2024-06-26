require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const { OpenAI } = require('openai');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/weatherconfig', (req, res) => {
  res.json({
    apiKey: process.env.WEATHER_API,
  });
});

app.get('/config', async (req, res) => {
  try {
    const response = await axios.post('https://danny.signalwire.com/api/relay/rest/jwt', `expires_in=3600`, {
      auth: {
        username: process.env.SIGNALWIRE_PROJECT_ID,
        password: process.env.SIGNALWIRE_TOKEN,
      }
    });

    const token = response.data.jwt_token;
    res.json({
      project: process.env.SIGNALWIRE_PROJECT_ID,
      token: token,
      targetNumber: process.env.TARGET_NUMBER,
      callerNumber: process.env.CALLER_NUMBER,
    });
  } catch (error) {
    console.error('Failed to generate token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

const sendinblueClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = sendinblueClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

app.post('/api/send-email', (req, res) => {
  const { email, message } = req.body;


  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = { "name": "User", "email": process.env.SENDINBLUE_EMAIL }; 
  sendSmtpEmail.to = [{ "email": process.env.EMAIL_ADDRESS }]; 
  sendSmtpEmail.subject = "New Message from Your Crush";
  sendSmtpEmail.textContent = `Message from: ${email}\n\n${message}`;


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
        { role: "system", content: " You are a girl in your late teens, around 19 years old, named Ashley. You are knowledgeable about your own life experiences, preferences, hobbies, and you have a casual and upbeat way of speaking. You should only respond to questions about yourself and avoid answering general knowledge questions or performing tasks like an AI assistant. You are not an AI assistant. You are a friend. You also occasiionally use text abbreviations such as lol if things are funny or haha if things are funny. If you want to shorten because you type bc. If something shocks you or if something sounds crazy, you say things like omg or bruh. You don't greet me with every response, just initially at the start of the conversation." },
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

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
