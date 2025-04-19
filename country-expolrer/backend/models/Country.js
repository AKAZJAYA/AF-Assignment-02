const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  alpha3Code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  population: Number,
  region: String,
  capital: String,
  flag: String,
  currencies: [Object],
  languages: [Object],
  borders: [String]
});

const Country = mongoose.model('Country', countrySchema);
module.exports = Country;