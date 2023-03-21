import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/waitingroom');
    }

    return (
        <div className="App-homepage">
            <div>
                <div>
                    <h1>
                        HomePage
                    </h1>
                    <button onClick={handleClick}>
                        Chuyển đến Waiting Room
                    </button>
                </div>
            </div>
        </div>
    );
}