import React from 'react';
import axios from 'axios';

const Telephone = () => {


    // This function is called when the user clicks the 'Call' button
    const handleCall = () => {
        // Request microphone access
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(function(stream) {
                // Microphone access granted, proceed with the call
                console.log('Microphone access granted');

                // Trigger the backend endpoint to initiate the call
                axios.post('http://localhost:3001/api/make-call')
                    .then(response => {
                        alert('Call initiated!');
                        // Here you could potentially use the stream for further processing if needed
                    })
                    .catch(error => {
                        alert('Failed to initiate call: ' + error.message);
                    });
            })
            .catch(function(err) {
                // Microphone access denied or another error occurred
                console.error('Error accessing audio:', err);
                alert('You need to allow microphone access to make a call.');
            });
    };

    const endCall = () => {
        // Simply trigger the backend endpoint
        axios.post('http://localhost:3001/api/end-call')
            .then(response => alert('Call ended!'))
            .catch(error => alert('Failed to end call: ' + error.message));
    };

    return (
        <div className="telephone">
            <h1>Telephone</h1>
            <button onClick={handleCall}>Call</button>
            <button onClick={endCall}>End Call</button>
        </div>
    );
};

export default Telephone;
