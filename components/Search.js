import React, { useState } from 'react';
import { fetchWeatherByQuery } from '../pages/api/weatherAPI';
import WeatherList from './WeatherList';
import Pagination from './Pagination';

const Search = () => {
  const [query, setQuery] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const handleSearch = () => {
    if (query.trim()) {
      fetchWeatherByQuery(query.trim())
        .then(data => {
          if (data.length > 0) {
            setWeatherData(data);
            setError('');
            setCurrentPage(0);
          } else {
            setError('No results found.');
            setWeatherData([]);
          }
        })
        .catch(() => setError('Error fetching weather data.'));
    } else {
      setError('Please enter a valid city name or city_name,country_code.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    const itemsPerPage = 3;
    if ((currentPage + 1) * itemsPerPage < weatherData.length) setCurrentPage(currentPage + 1);
  };

  const itemsPerPage = 3;
  const paginatedData = weatherData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className="container mt-3">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="form-control"
            placeholder="Enter city name or city_name,country_code"
          />
          <button onClick={handleSearch} className="btn btn-primary mt-2">Search</button>
          {error && <p className="text-danger mt-2">{error}</p>}
        </div>
      </div>
      <h2 className="text-center mt-4">Weather</h2>
      {weatherData.length > 0 && <WeatherList weatherData={paginatedData} />}
      {weatherData.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalItems={weatherData.length}
          itemsPerPage={itemsPerPage}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default Search;
