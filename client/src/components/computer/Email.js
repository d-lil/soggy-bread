import React, { useState } from 'react';
import './css/Email.css';
import emailGif from "./assets/email_gif.gif"
import eIcon from "./assets/e.png"
import mIcon from "./assets/m.png"
import aIcon from "./assets/a.png"
import iIcon from "./assets/i.png"
import lIcon from "./assets/l.png"

const Email = () => {
   const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { email, message };
    const response = await fetch('http://localhost:3001/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert('Message sent!');
        setEmail('');
      setMessage(''); 
    } else {
      alert('Failed to send message :(');
    }
  };

  return (
    <div className="email-page">
    <img src={emailGif} alt="email gif" className='email-gif'/>
    <div className='email-icons'>
    <img src={eIcon} alt="e icon" className='email-icon e1'/>
    <img src={mIcon} alt="m icon" className='email-icon e2'/>
    <img src={aIcon} alt="a icon" className='email-icon e3'/>
    <img src={iIcon} alt="i icon" className='email-icon e4'/>
    <img src={lIcon} alt="l icon" className='email-icon e5'/>
    </div>
      <h2 className='email-h2'>If you'd like to email me, please fill out the form below</h2>
    <form onSubmit={handleSubmit} className='email-form'>
      <label htmlFor="email" className='email-label'>Your email so I can respond to you:</label>
      <span className='required'>*required</span>
      <br />
        <input
            type="email"
            className='email-input'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
        />
      <br />
      <label htmlFor="message" className='email-label'>Message:</label>
      <span className='required'>*required</span>
      <br />
      <textarea
        value={message}
        className='email-textarea'
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Send me a message!"
        required
    />

      <br />
      <button type="submit" className='email-submit-button'>Send</button>
    </form>
    </div>
  );
}

export default Email;
