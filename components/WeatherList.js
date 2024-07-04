// components/WeatherList.js
import React from 'react';
import WeatherCard from '@/components/WeatherCard';

const WeatherList = ({ weatherData }) => {
  console.log(weatherData); // Log the weather data to check the structure
  return (
    <div className="d-flex flex-wrap mt-5">
      {weatherData.map((data, index) => (
        <WeatherCard key={index} data={data} />
      ))}
    </div>
  );
};


export default WeatherList;
