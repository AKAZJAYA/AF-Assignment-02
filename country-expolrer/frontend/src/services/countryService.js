// client/src/services/countryService.js
import axios from 'axios';

const API_URL = 'https://restcountries.com/v3.1';

export const getCountries = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

export const getCountryByCode = async (code) => {
  try {
    const response = await axios.get(`${API_URL}/alpha/${code}`);
    return response.data[0];
  } catch (error) {
    console.error(`Error fetching country with code ${code}:`, error);
    throw error;
  }
};

export const getCountriesByRegion = async (region) => {
  try {
    const response = await axios.get(`${API_URL}/region/${region}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching countries in region ${region}:`, error);
    throw error;
  }
};

export const getCountriesBySubregion = async (subregion) => {
  try {
    // First get all countries, then filter by subregion
    const response = await axios.get(`${API_URL}/all`);
    return response.data.filter(country => 
      country.subregion && country.subregion.toLowerCase() === subregion.toLowerCase()
    );
  } catch (error) {
    console.error(`Error fetching countries in subregion ${subregion}:`, error);
    throw error;
  }
};