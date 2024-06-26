import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './css/Weather.css';
import cloudVideo from './assets/clouds.mp4';
import rain from './assets/rain.png';
import snow from './assets/snow.png';
import wind from './assets/wind.png';
import sun from './assets/sun.png';
import cloudy from './assets/cloudy.png';
import lightning from './assets/lightning.png';
import weatherLogo from './assets/weather_logo.png';
import axios from 'axios';

const WeatherHeader = () => {
    const icons = [rain, snow, wind, sun, cloudy, lightning];
    const [currentIcon, setCurrentIcon] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIcon((prevIcon) => (prevIcon + 1) % icons.length);
        }, 2000);

        return () => clearInterval(intervalId);
    }, [currentIcon]);

    return (
        <div className='weather-header'>
            <h1>Weather Wizard <img src={weatherLogo} alt="weather app logo" className='weather-app-logo' /><hr /></h1>
            <div className='weather-icons'>
                {icons.map((icon, index) => (
                    <img
                        key={icon}
                        src={icon}
                        className={`weather-header-icon ${currentIcon === index ? 'visible' : ''}`}
                        alt=""
                        style={{
                            opacity: currentIcon === index ? 1 : 0,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

const WeatherCard = ({ date, icon, temp, wind, humidity }) => (
    <div className="weather-card">
        <p className='date-data'>{date}</p>
        {icon && <img src={`https://openweathermap.org/img/wn/${icon}.png`} className='weather-icon' alt="weather icon" />}
        <p className='data-p'><span className='data'>Temp: {temp} ℉</span></p>
        <p className='data-p'><span className='data'>Wind: {wind} MPH</span></p>
        <p className='data-p'><span className='data'>Humidity: {humidity} %</span></p>
    </div>
);

const Weather = () => {
    const [city, setCity] = useState(localStorage.getItem('tempclick') || '');
    const [currentWeather, setCurrentWeather] = useState({});
    const [forecast, setForecast] = useState([]);
    const [error, setError] = useState(null);
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await axios.get('http://localhost:3001/weatherconfig');
                const config = response.data;
                setApiKey(config.apiKey);
            } catch (error) {
                console.error('Failed to fetch config:', error);
            }
        };
        fetchConfig();
    }, []);

    const fetchCurrentWeather = async (city) => {
        try {
            const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.cod !== 200) {
                throw new Error(data.message);
            }
            setCurrentWeather({
                name: data.name,
                temp: data.main.temp,
                wind: data.wind.speed,
                humidity: data.main.humidity,
                icon: data.weather[0].icon,
            });
            localStorage.setItem('tempclick', city);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchForecast = async (city) => {
        try {
            const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.cod !== "200") {
                throw new Error(data.message);
            }
            if (data.list && data.list.length > 0) {
                setForecast(
                    data.list.filter((_, index) => index % 8 === 0).map((item) => ({
                        date: dayjs(item.dt_txt).format('dddd MM/DD/YYYY'),
                        temp: item.main.temp,
                        wind: item.wind.speed,
                        humidity: item.main.humidity,
                        icon: item.weather[0].icon,
                    }))
                );
            } else {
                setForecast([]);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };

    const handleSearch = () => {
        if (city) {
            fetchCurrentWeather(city);
            fetchForecast(city);
        }
    };

    //Background video by João Pavese: https://www.pexels.com/video/time-lapse-of-cloud-formations-6707366/
    //Icons from icons8
    return (
        <div className='weather-container'>
            <video autoPlay loop muted className="weather-background-video">
                <source src={cloudVideo} type="video/mp4" />
            </video>
            <WeatherHeader />
            <div className='weather-search'>
                <h3>Search for a City:</h3>
                <input
                    type="text"
                    value={city}
                    onChange={handleCityChange}
                    placeholder="Pee Pee Township"
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <button onClick={handleSearch} className='weather-search-btn'>Search</button>
            </div>
            <br />
            <hr />
            <div>
                {Object.keys(currentWeather).length > 0 && (
                    <h3 className='city-name'>{currentWeather.name}</h3>
                )}
                {Object.keys(currentWeather).length > 0 && (
                    <div className='forecast-today'>
                        <h4>Today's Weather</h4>
                        <WeatherCard {...currentWeather} date={dayjs().format('dddd MM/DD/YYYY')} />
                    </div>
                )}
                <h3>5-Day Forecast:</h3>
                <div className='forecast-grid'>
                    {forecast.map((weather, index) => (
                        <WeatherCard key={index} {...weather} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Weather;
