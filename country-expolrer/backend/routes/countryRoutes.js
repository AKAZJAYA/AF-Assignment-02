const express = require("express");
const router = express.Router();
const axios = require("axios");
const auth = require("../middleware/authMiddleware");

const BASE_URL = "https://restcountries.com/v3.1";

// Get all countries
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/all`);

    // Transform the data to match our schema
    const countries = response.data.map((country) => ({
      alpha3Code: country.cca3,
      name: country.name.common,
      population: country.population,
      region: country.region,
      capital: country.capital ? country.capital[0] : "",
      flag: country.flags.png,
      currencies: country.currencies
        ? Object.values(country.currencies).map((c) => ({
            name: c.name,
            symbol: c.symbol,
          }))
        : [],
      languages: country.languages ? Object.values(country.languages) : [],
      borders: country.borders || [],
      subregion: country.subregion || "",
      area: country.area || null,
      timezones: country.timezones || [],
      nativeName: country.name.nativeName
        ? Object.values(country.name.nativeName)[0].common
        : country.name.common,
      topLevelDomain: country.tld || [],
      callingCodes:
        country.idd?.suffixes?.map(
          (suffix) => `${country.idd.root}${suffix}`
        ) || [],
    }));

    res.json(countries);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching countries", error: error.message });
  }
});

// Get country by code
router.get("/:code", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/alpha/${req.params.code}`);
    const country = response.data[0];

    const formattedCountry = {
      alpha3Code: country.cca3,
      name: country.name.common,
      population: country.population,
      region: country.region,
      subregion: country.subregion || "",
      capital: country.capital ? country.capital[0] : "",
      flag: country.flags.png,
      currencies: country.currencies
        ? Object.values(country.currencies).map((c) => ({
            name: c.name,
            symbol: c.symbol,
          }))
        : [],
      languages: country.languages ? Object.values(country.languages) : [],
      borders: country.borders || [],
      area: country.area || null,
      timezones: country.timezones || [],
      nativeName: country.name.nativeName
        ? Object.values(country.name.nativeName)[0].common
        : country.name.common,
      topLevelDomain: country.tld || [],
      callingCodes:
        country.idd?.suffixes?.map(
          (suffix) => `${country.idd.root}${suffix}`
        ) || [],
      maps: {
        googleMaps: country.maps?.googleMaps || null,
        openStreetMaps: country.maps?.openStreetMaps || null,
      },
      flagAlt: country.flags?.alt || "",
      coatOfArms: country.coatOfArms?.png || null,
      startOfWeek: country.startOfWeek || null,
      capitalInfo: {
        latlng: country.capitalInfo?.latlng || null,
      },
      continents: country.continents || [],
      unMember: country.unMember || false,
      independent: country.independent || false,
      landlocked: country.landlocked || false,
      carSide: country.car?.side || null,
      demonyms: country.demonyms?.eng
        ? {
            male: country.demonyms.eng.m,
            female: country.demonyms.eng.f,
          }
        : null,
    };

    res.json(formattedCountry);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res
        .status(404)
        .json({ message: "Country not found with that code" });
    }
    res.status(500).json({
      message: "Error fetching country details",
      error: error.message,
    });
  }
});

// Search countries by name
router.get("/search/:term", async (req, res) => {
  try {
    const term = req.params.term;
    const response = await axios.get(`${BASE_URL}/name/${term}`);

    const countries = response.data.map((country) => ({
      alpha3Code: country.cca3,
      name: country.name.common,
      population: country.population,
      region: country.region,
      capital: country.capital ? country.capital[0] : "",
      flag: country.flags.png,
      subregion: country.subregion || "",
      area: country.area || null,
      currencies: country.currencies
        ? Object.values(country.currencies).map((c) => ({
            name: c.name,
            symbol: c.symbol,
          }))
        : [],
      languages: country.languages ? Object.values(country.languages) : [],
      borders: country.borders || [],
      timezones: country.timezones || [],
      topLevelDomain: country.tld || [],
      callingCodes:
        country.idd?.suffixes?.map(
          (suffix) => `${country.idd.root}${suffix}`
        ) || [],
    }));

    res.json(countries);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res
        .status(404)
        .json({ message: "No countries found with that name" });
    }
    res
      .status(500)
      .json({ message: "Error searching countries", error: error.message });
  }
});

// Get countries by region
router.get("/region/:region", async (req, res) => {
  try {
    const { region } = req.params;
    const response = await axios.get(`${BASE_URL}/region/${region}`);

    const countries = response.data.map((country) => ({
      alpha3Code: country.cca3,
      name: country.name.common,
      population: country.population,
      region: country.region,
      subregion: country.subregion || "",
      capital: country.capital ? country.capital[0] : "",
      flag: country.flags.png,
      area: country.area || null,
      timezones: country.timezones || [],
      topLevelDomain: country.tld || [],
      callingCodes:
        country.idd?.suffixes?.map(
          (suffix) => `${country.idd.root}${suffix}`
        ) || [],
    }));

    res.json(countries);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res
        .status(404)
        .json({ message: "No countries found in that region" });
    }
    res.status(500).json({
      message: "Error fetching countries by region",
      error: error.message,
    });
  }
});

module.exports = router;
