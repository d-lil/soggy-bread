require('dotenv').config();
const express = require('express');
const cors = require('cors');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const { OpenAI } = require('openai');
// const fetch = require('node-fetch');
// const createDOMPurify = require('dompurify');
// const { JSDOM } = require('jsdom');

const app = express();

app.use(cors());
app.use(express.json());

const sendinblueClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = sendinblueClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;


const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

app.post('/api/send-email', (req, res) => {
  const { email, message } = req.body;

  // Configuring the email to be sent
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = { "name": "User", "email": process.env.SENDINBLUE_EMAIL }; // Use a general sender email you've verified with Sendinblue
  sendSmtpEmail.to = [{ "email": process.env.EMAIL_ADDRESS }]; // Your personal email
  sendSmtpEmail.subject = "New Message from Your Crush";
  sendSmtpEmail.textContent = `Message from: ${email}\n\n${message}`; // Include the sender's email in the message body

  // Sending the email
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

    // Access the message content directly without the data property
    const messageContent = response.choices[0].message.content.trim();

    // Send the message content to the frontend
    res.json({ aiResponse: messageContent });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Send back the error for debugging
    res.status(500).send(`Error generating AI response: ${error.message}`);
  }
});

// List of allowed URLs
const allowedDomains = [
  'https://example.com',
  'https://news.example.com',
  'https://info.example.com'
];


app.get('/api/content', async (req, res) => {
  const { url } = req.query;

  if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
  }

  let hostname;
  try {
      // Parse the URL to get the hostname
      hostname = new URL(url).hostname;
  } catch (error) {
      return res.status(400).json({ error: 'Invalid URL' });
  }

  // Check if the hostname is in the allowed domains list
  if (!allowedDomains.includes(hostname)) {
      return res.status(403).json({ error: 'Access to the requested domain is denied' });
  }

  try {
      const response = await fetch(url);
      const html = await response.text();
      const window = new JSDOM('').window;
      const DOMPurify = createDOMPurify(window);

      const cleanHTML = DOMPurify.sanitize(html);
      
      res.send(cleanHTML);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch content' });
  }
});





const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
