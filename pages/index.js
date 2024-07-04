// pages/Home.js

import React, { useState, useEffect } from 'react';
import { fetchWeatherByCoords } from './api/weatherAPI';
import WeatherCard from './components/WeatherCard';
import { useAtom } from 'jotai';
import { visitedCitiesAtom, updateLocalStorage } from './atoms/jotai';

const Home = () => {
  const [localWeather, setLocalWeather] = useState(null);
  const [error, setError] = useState('');
  const [visitedCities, setVisitedCities] = useAtom(visitedCitiesAtom);

  useEffect(() => {
    const fetchLocalWeather = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const data = await fetchWeatherByCoords(latitude, longitude);
              setLocalWeather(data);

              // Check if the city is already in visitedCities
              const cityExists = visitedCities.some(city => city.id === data.id);
              if (!cityExists) {
                // Update visitedCities with the new local weather data
                const updatedCities = [...visitedCities, data];
                setVisitedCities(updatedCities);
                updateLocalStorage(updatedCities);
              }
            },
            (error) => {
              console.error('Geolocation error:', error);
              setError('Location access denied.');
            }
          );
        } else {
          console.error('Geolocation not supported');
          setError('Geolocation is not supported by this browser.');
        }
      } catch (error) {
        console.error('Error fetching local weather:', error);
        setError('Error fetching local weather.');
      }
    };

    if (!localWeather) {
      fetchLocalWeather();
    }
  }, [localWeather]); // Ensure useEffect runs only when localWeather changes

  return (
    <div>
      <h1>Local Weather</h1>
      {localWeather ? (
        <WeatherCard data={localWeather} isLocalWeather />
      ) : (
        <p>{error ? error : 'Loading...'}</p>
      )}
    </div>
  );
};

export default Home;
