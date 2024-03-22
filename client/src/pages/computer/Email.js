import React, { useState } from 'react';

const Email = () => {
   const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { email, message };
    const response = await fetch('/api/send-email', {
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
    <form onSubmit={handleSubmit}>
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
        />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Send me a message!"
        required
      ></textarea>
      <button type="submit">Send</button>
    </form>
  );
}

export default Email;
