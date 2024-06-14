
// import React, { useState } from 'react';
// import axios from 'axios';
// import './css/Telephone.css';
// import dannyPic from './assets/danny.jpg';

// const Telephone = () => {
//     const [isConnected, setIsConnected] = useState(false);
//     const [callTime, setCallTime] = useState(0);
//     const [timer, setTimer] = useState(null);

//     const handleCall = () => {
//         axios.post('http://localhost:3001/make-call', { number: '13038815725' }) // Adjust endpoint if necessary
//             .then(response => {
//                 console.log('Call initiated:', response);
//                 setIsConnected(true);
//                 setCallTime(Date.now());  // Start timing the call
//                 setTimer(setInterval(() => {
//                     setCallTime(oldTime => Date.now() - oldTime);
//                 }, 1000));
//             })
//             .catch(error => {
//                 console.error('Error initiating call:', error);
//                 setIsConnected(false);
//             });
//     };

//     const endCall = () => {
//         clearInterval(timer);
//         setTimer(null);
//         setIsConnected(false);
//         setCallTime(0);  // Reset the call timer
//     };

//     const renderCallStatus = () => {
//         if (isConnected) {
//             const hours = Math.floor(callTime / 3600000);
//             const minutes = Math.floor((callTime % 3600000) / 60000);
//             const seconds = Math.floor((callTime % 60000) / 1000);
//             return `Call Connected: ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//         } else {
//             return "Call Ended";
//         }
//     };

//     return (
//         <div className="telephone">
//             <div className='telephone-header'>
//                 <h1>Danny</h1>
//                 <p>Phone number: (303) 881 - 5725</p>
//             </div>
//             <img src={dannyPic} alt="Danny" className='danny-picture' />
//             <div className="phone-buttons">
//                 <button onClick={handleCall} disabled={isConnected} className='call-button'>Call</button>
//                 <button onClick={endCall} disabled={!isConnected} className='end-connected'>End</button>
//             </div>
//             <div className='call-status'>
//                 {renderCallStatus()}
//             </div>
//         </div>
//     );
// };

// export default Telephone;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Telephone.css';
import dannyPic from './assets/danny.jpg';
import { Device } from 'twilio-client';  // Ensure this is correctly imported

const Telephone = () => {
    const [device, setDevice] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3001/token')  // Ensure correct endpoint
            .then(response => {
                const deviceSetup = new Device();
                deviceSetup.setup(response.data.token);
                deviceSetup.on('ready', (device) => {
                    console.log('Twilio.Device Ready!');
                    setDevice(deviceSetup);
                });
                deviceSetup.on('connect', (conn) => {
                    console.log('Successfully established call!');
                    setIsConnected(true);
                });
                deviceSetup.on('disconnect', (conn) => {
                    console.log('Call ended.');
                    setIsConnected(false);
                });
                deviceSetup.on('error', (error) => {
                    console.error('Twilio.Device Error:', error);
                    setIsConnected(false);
                });
            })
            .catch(error => console.error('Token fetching error:', error));
    }, []);

    const handleCall = () => {
        device && device.connect({ number: '13038815725' });  // Use your actual phone number here
    };

    const endCall = () => {
        device && device.disconnectAll();
    };

    return (
        <div className="telephone">
            <div className='telephone-header'>
                <h1>Danny</h1>
                <p>Phone number: (303) 881 - 5725</p>
            </div>
            <img src={dannyPic} alt="Danny" className='danny-picture' />
            <div className="phone-buttons">
                <button onClick={handleCall} disabled={isConnected} className='call-button'>Call</button>
                <button onClick={endCall} disabled={!isConnected} className='end-connected'>End</button>
            </div>
        </div>
    );
};

export default Telephone;
