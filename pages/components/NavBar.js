// components/NavigationBar.js

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { visitedCitiesAtom } from '../atoms/jotai';

const NavigationBar = () => {
  const [searchId, setSearchId] = useState('');
  const [visitedCities, setVisitedCities] = useAtom(visitedCitiesAtom);
  const router = useRouter();

  useEffect(() => {
    const storedVisitedCities = JSON.parse(localStorage.getItem('visitedCities') || '[]');
    setVisitedCities(storedVisitedCities);
  }, [setVisitedCities]);

  const handleInputChange = (e) => {
    setSearchId(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (searchId) {
      router.push(`/city/${searchId}`);
      setSearchId(''); // Optionally clear the input after searching
    }
  };

  const handleDeleteCity = (id) => {
    const updatedCities = visitedCities.filter((city) => city.id !== id);
    setVisitedCities(updatedCities);
    localStorage.setItem('visitedCities', JSON.stringify(updatedCities));
  };

  const handleClearAll = () => {
    setVisitedCities([]);
    localStorage.removeItem('visitedCities');
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Navbar.Brand href="/">Weather App by Thuan</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <NavDropdown title="Previously Viewed" id="basic-nav-dropdown">
            {visitedCities.length > 0 ? (
              visitedCities.map((city) => (
                <NavDropdown.Item key={city.id}>
                  <Link href={`/city/${city.id}`} passHref>{city.id}</Link>
                  <Button variant="link" className="btn-sm ms-2 text-danger" onClick={() => handleDeleteCity(city.id)}>Delete</Button>
                </NavDropdown.Item>
              ))
            ) : (
              <NavDropdown.Item>No cities viewed</NavDropdown.Item>
            )}
            {visitedCities.length > 0 && (
              <NavDropdown.Divider />
            )}
            {visitedCities.length > 0 && (
              <NavDropdown.Item>
                <Button variant="link" className="text-danger" onClick={handleClearAll}>Clear All</Button>
              </NavDropdown.Item>
            )}
          </NavDropdown>
        </Nav>
        <Form className="d-flex ms-auto" onSubmit={handleFormSubmit}>
          <FormControl
            type="text"
            placeholder="City ID"
            className="me-2"
            value={searchId}
            onChange={handleInputChange}
          />
          <Button variant="outline-info" type="submit">Search</Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
