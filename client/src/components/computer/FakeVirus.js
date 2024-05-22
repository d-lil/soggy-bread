import React, { useState } from 'react';
import './css/FakeVirus.css';

function FakeVirus() {
    const [windows, setWindows] = useState([]);

    const handleButtonClick = () => {
        // Both types of popups start simultaneously
        const totalPopups = 30; // Number of each type of popups

        for (let i = 0; i < totalPopups; i++) {
            // Cascading popups
            setTimeout(() => {
                const newWindow = {
                    id: `cascading-${i}`,
                    message: 'Your computer is infected. Click OK to fix it.',
                    top: 20 + i * 30,
                    left: 25 + i * 30,
                    positionType: 'cascading'
                };
                setWindows(wins => [...wins, newWindow]);
            }, i * 100);

            // Random popups
            setTimeout(() => {
                const newWindow = {
                    id: `random-${i}`,
                    message: '❌Critical error',
                    top: Math.random() * (window.innerHeight - 200),
                    left: Math.random() * (window.innerWidth - 300),
                    positionType: 'random'
                };
                setWindows(wins => [...wins, newWindow]);
            }, i * 100);
        }

        // Set timeout to clear all popups after 3 seconds
        setTimeout(() => {
            setWindows([]);
        }, 4000);
    };

    return (
        <div>
            <button onClick={handleButtonClick}>Download</button>
            <div className="windows-container">
                {windows.map(window => (
                    <div key={window.id} className={`fake-popup ${window.positionType}`} style={{
                        top: `${window.top}px`,
                        left: `${window.left}px`,
                        zIndex: 1000
                    }}>
                        <div className="popup-window">
                            <div className="virus-title-bar">
                                <span className="virus-title-text">Error</span>
                                <button className="virus-close-button" onClick={() => setWindows(wins => wins.filter(w => w.id !== window.id))}>x</button>
                            </div>
                            <p>{window.message}</p>
                            <button className='virus-button'>OK</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FakeVirus;
