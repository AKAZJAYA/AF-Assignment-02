const express = require('express');
const router = express.Router();
const axios = require('axios');
const Country = require('../models/Country');
const auth = require('../middleware/auth');

// Get all countries
router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    
    // Transform the data to match our schema
    const countries = response.data.map(country => ({
      alpha3Code: country.cca3,
      name: country.name.common,
      population: country.population,
      region: country.region,
      capital: country.capital ? country.capital[0] : '',
      flag: country.flags.png,
      currencies: country.currencies ? Object.values(country.currencies) : [],
      languages: country.languages ? Object.values(country.languages) : [],
      borders: country.borders || []
    }));
    
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get country by code
router.get('/:code', async (req, res) => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/alpha/${req.params.code}`);
    const country = response.data[0];
    
    const formattedCountry = {
      alpha3Code: country.cca3,
      name: country.name.common,
      population: country.population,
      region: country.region,
      capital: country.capital ? country.capital[0] : '',
      flag: country.flags.png,
      currencies: country.currencies ? Object.values(country.currencies) : [],
      languages: country.languages ? Object.values(country.languages) : [],
      borders: country.borders || []
    };
    
    res.json(formattedCountry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search countries
router.get('/search/:term', async (req, res) => {
  try {
    const term = req.params.term;
    const response = await axios.get(`https://restcountries.com/v3.1/name/${term}`);
    
    const countries = response.data.map(country => ({
      alpha3Code: country.cca3,
      name: country.name.common,
      population: country.population,
      region: country.region,
      capital: country.capital ? country.capital[0] : '',
      flag: country.flags.png
    }));
    
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;