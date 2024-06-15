import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Telephone.css';
import dannyPic from './assets/danny.jpg';
import { Device } from 'twilio-client';  

const Telephone = () => {
    const [device, setDevice] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [timer, setTimer] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/token')  
            .then(response => {
                const deviceSetup = new Device();
                deviceSetup.setup(response.data.token);
                deviceSetup.on('ready', (device) => {
                    setDevice(deviceSetup);
                });
                deviceSetup.on('connect', (conn) => {
                    console.log('Successfully established call!');
                    setIsConnected(true);
                    startTimer();
                });
                deviceSetup.on('disconnect', (conn) => {
                    console.log('Call ended.');
                    setIsConnected(false);
                    stopTimer();
                    setTimeout(() => setTimer(0), 3000);
                });
                deviceSetup.on('error', (error) => {
                    console.error('Twilio.Device Error:', error);
                    setIsConnected(false);
                    stopTimer();
                    setTimeout(() => setTimer(0), 3000);
                });
            })
            .catch(error => console.error('Token fetching error:', error));
    }, []);

    const handleCall = () => {
        if (window.confirm("This will call Danny. Continue? \n *Must allow microphone access*")) {
            connectCall();
        }
    };

    const connectCall = () => {
        device && device.connect({ number: '13038815725' });
    }

    const endCall = () => {
        device && device.disconnectAll();
    };

    const startTimer = () => {
        const id = setInterval(() => {
            setTimer(oldTime => oldTime + 1);
        }, 1000);
        setIntervalId(id);
    };

    const stopTimer = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
            <div className="call-status">
                {isConnected ? `Call Connected: ${formatTime(timer)}` : "Call Ended"}
            </div>
        </div>
    );
};

export default Telephone;
