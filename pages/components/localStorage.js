import React, { createContext, useState } from 'react';

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [visitedCities, setVisitedCities] = useState([]);

  const updateVisitedCities = (cities) => {
    setVisitedCities(cities);
    localStorage.setItem('visitedCities', JSON.stringify(cities));
  };

  return (
    <WeatherContext.Provider value={{ visitedCities, updateVisitedCities }}>
      {children}
    </WeatherContext.Provider>
  );
};
