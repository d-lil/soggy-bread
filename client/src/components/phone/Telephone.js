import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dannyPic from './assets/danny.jpg';
import './css/Telephone.css';
import { Relay } from '@signalwire/js';

const Telephone = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [currentCall, setCurrentCall] = useState(null);
  const [config, setConfig] = useState({});
  const [client, setClient] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const [stream, setStream] = useState(null);
  const [callEndedMessage, setCallEndedMessage] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get('http://localhost:3001/config');
        const config = response.data;

        if (config.project && config.token) {
          setConfig(config);
        } else {
          console.error('Config missing project or token:', config);
        }
      } catch (error) {
        console.error('Failed to fetch config:', error);
      }
    };

    fetchConfig();
  }, []);

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone permission granted');
      setPermissionStatus('granted');
      setStream(stream);
      return stream;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setPermissionStatus('denied');
      throw error; // Rethrow the error to handle it in the caller function
    }
  };

  useEffect(() => {
    const checkAndRequestPermissions = async () => {
      try {
        await requestPermissions();
      } catch (error) {
        console.error('Failed to get microphone permissions on load:', error);
      }
    };

    checkAndRequestPermissions();
  }, []);

  const connect = () => {
    if (config && config.project && config.token) {
      const newClient = new Relay({
        project: config.project,
        token: config.token,
      });

      newClient.on('signalwire.ready', () => {
        setIsConnected(true);
        console.log('Connected to SignalWire');
      });

      newClient.on('signalwire.error', (error) => {
        console.error('SignalWire error:', error);
      });

      newClient.on('signalwire.notification', handleNotification);

      newClient.connect();
      setClient(newClient);
    } else {
      console.error('Configuration is not set');
    }
  };

  const handleNotification = (notification) => {
    if (notification.type === 'callUpdate') {
      handleCallUpdate(notification.call);
    }
  };

  const handleCallUpdate = (call) => {
    setCurrentCall(call);
    switch (call.state) {
      case 'new':
        break;
      case 'trying':
        startTimer();
        setIsCallActive(true);
        setCallEndedMessage(false);
        break;
      case 'active':
        setIsCallActive(true);
        break;
      case 'hangup':
      case 'destroy':
        stopTimer();
        setIsCallActive(false);
        setCurrentCall(null);
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
        const audioElement = document.getElementById('remoteAudio');
        if (audioElement) {
          audioElement.srcObject = null;
        }
        setCallEndedMessage(true);
        setTimeout(() => {
          setCallEndedMessage(false);
        }, 3000); // Show "Call Ended" message for 3 seconds
        break;
      default:
        break;
    }
  };

  const handleCall = async () => {
    try {
      const stream = await requestPermissions();
      if (client) {
        const params = {
          destinationNumber: config.targetNumber,
          callerNumber: config.callerNumber,
          audio: true,
          video: false,
        };
        const newCall = client.newCall(params);
        setCurrentCall(newCall);

        // Attach the stream to the audio element
        const audioElement = document.getElementById('remoteAudio');
        if (audioElement) {
          audioElement.srcObject = stream;
        }
      }
    } catch (error) {
      console.error('Failed to initiate call:', error);
    }
  };

  const handleEndCall = () => {
    if (currentCall) {
      currentCall.hangup();
      setCurrentCall(null);
      setIsCallActive(false);
      stopTimer();
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      const audioElement = document.getElementById('remoteAudio');
      if (audioElement) {
        audioElement.srcObject = null;
      }
      setCallEndedMessage(true);
      setTimeout(() => {
        setCallEndedMessage(false);
      }, 3000); // Show "Call Ended" message for 3 seconds
    }
  };

  const startTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setTimer(0); // Reset timer at the start of a new call
    const id = setInterval(() => {
      setTimer((oldTime) => oldTime + 1);
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

  useEffect(() => {
    if (config.project && config.token) {
      connect();
    }
  }, [config]);

  return (
    <div className="telephone">
      <div className='telephone-header'>
        <h1>Danny</h1>
        <p>Phone number: (303) 881 - 5725</p>
      </div>
      <img src={dannyPic} alt="Danny" className='danny-picture' />
      <div className="phone-buttons">
        <button onClick={handleCall} disabled={permissionStatus !== 'granted' || !isConnected || isCallActive} className='call-button'>Call</button>
        <button onClick={handleEndCall} disabled={!isCallActive} className='end-connected'>End</button>
      </div>
      <div className="call-status">
        {isCallActive ? `Call Connected: ${formatTime(timer)}` : callEndedMessage ? 'Call Ended.' : ''}
      </div>
      {isCallActive && (
        <div className="call-notification">
          <p>Please wait for Danny to pick up the phone.</p>
          <p>It takes a few seconds to connect!</p>
        </div>
      )}
      {permissionStatus === 'denied' && (
        <div className="permission-status">
          Microphone Permission: {permissionStatus}
        </div>
      )}
      <audio id="remoteAudio" autoPlay></audio>
    </div>
  );
};

export default Telephone;
