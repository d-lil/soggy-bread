import React from 'react';
import { Link } from 'react-router-dom';
import './css/Computer.css';

const Computer = () => {
    return (
        <div>
            <div className="screen">
            <div className="nav">
                <Link to="/computer">Home</Link>
                <Link to="/email">Email</Link>
                {/* <Link to="/call">Call</Link> */}
            </div>
            </div>

        <h1>Computer</h1>
        </div>
    );
    }

export default Computer;