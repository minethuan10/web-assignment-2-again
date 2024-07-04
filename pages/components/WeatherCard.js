import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { visitedCitiesAtom } from '../atoms/jotai';

const WeatherCard = ({ data, isLocalWeather }) => {
  if (!data || !data.sys || !data.main || !data.weather) {
    return null;
  }

  const { id, name, sys, weather, main, wind } = data;
  const [showDetails, setShowDetails] = useState(false);
  const [visitedCities, setVisitedCities] = useAtom(visitedCitiesAtom);
  const [isCelsius, setIsCelsius] = useState(true); // Default to Celsius

  const toggleDetails = () => {
    setShowDetails(!showDetails);

    // Check if city data is already in visitedCities
    const cityIds = new Set(visitedCities.map((city) => city.id));
    if (!cityIds.has(id)) {
      // Add to visitedCities if details are shown
      if (!showDetails) {
        const newCity = { id, name, sys, weather, main, wind };
        setVisitedCities((prev) => [...prev, newCity]);
        localStorage.setItem('visitedCities', JSON.stringify([...visitedCities, newCity]));
      }
    }
  };

  const convertToFahrenheit = (celsius) => {
    return (celsius * 9 / 5) + 32;
  };

  const formatTemperature = (temperature) => {
    return parseFloat(temperature.toFixed(1)).toString();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleTemperatureToggle = () => {
    setIsCelsius(!isCelsius);
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card weather-card">
        <div className="card-body">
          <h5 className="card-title">{name}, {sys.country}</h5>
          <img src={`http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`} alt="Weather Icon" />
          <p className="card-text">Weather: {weather[0].description}</p>
          <p className="card-text">
            Temperature: {isCelsius ? `${formatTemperature(main.temp)}°C` : `${formatTemperature(convertToFahrenheit(main.temp))}°F`}
          </p>
          <button className="btn btn-sm btn-secondary mb-2" onClick={toggleDetails}>
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          <button className="btn btn-sm btn-info mb-2 ml-2" onClick={handleTemperatureToggle}>
            {isCelsius ? 'Show in Fahrenheit' : 'Show in Celsius'}
          </button>
          {showDetails && (
            <>
              <p className="card-text">
                Min/Max Temperature: {isCelsius
                  ? `${formatTemperature(main.temp_min)}°C / ${formatTemperature(main.temp_max)}°C`
                  : `${formatTemperature(convertToFahrenheit(main.temp_min))}°F / ${formatTemperature(convertToFahrenheit(main.temp_max))}°F`}
              </p>
              <p className="card-text">Humidity: {main.humidity}%</p>
              <p className="card-text">Pressure: {main.pressure} hPa</p>
              {wind && <p className="card-text">Wind Speed: {wind.speed} m/s</p>}
              {sys && (
                <>
                  <p className="card-text">Sunrise: {formatTime(sys.sunrise)}</p>
                  <p className="card-text">Sunset: {formatTime(sys.sunset)}</p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
