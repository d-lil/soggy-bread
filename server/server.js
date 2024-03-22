const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

let transporter = nodemailer.createTransport({
  // Example with Gmail; for other services, you'll need different settings
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-password', // Consider using OAuth2 or an app-specific password
  },
});

app.post('/api/send-email', (req, res) => {
  const { email, message } = req.body;

  let mailOptions = {
    from: email, // User's email
    to: 'your-email@gmail.com', // Your email
    subject: 'New Message from Website',
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
