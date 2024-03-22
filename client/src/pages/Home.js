import React from 'react';
import './css/Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
        <h1>Home</h1>
        <Link to="/computer">Computer</Link>
        </div>
    );
    }

export default Home;