import React, { useState } from 'react';
import './css/Email.css';

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
      <h2 className='email-h2'>If you'd like to email me, please fill out the form below</h2>
    <form onSubmit={handleSubmit} className='email-form'>
      <label htmlFor="email" className='email-label'>Your email so I can respond to you:</label>
      <br />
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
        /><span className='required'>*required</span>
      <br />
      <label htmlFor="message" className='email-label'>Message:</label>
      <br />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Send me a message!"
        required
    />
    <span className='required'>*required</span>
      <br />
      <button type="submit">Send</button>
    </form>
    </div>
  );
}

export default Email;
