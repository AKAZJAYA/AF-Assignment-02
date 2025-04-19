// client/src/redux/slices/countriesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCountries, getCountriesByRegion, getCountriesBySubregion } from '../../services/countryService';

export const fetchCountries = createAsyncThunk(
  'countries/fetchCountries',
  async () => {
    const response = await getCountries();
    return response;
  }
);

export const fetchCountriesByRegion = createAsyncThunk(
  'countries/fetchCountriesByRegion',
  async (region) => {
    const response = await getCountriesByRegion(region);
    return response;
  }
);

export const fetchCountriesBySubregion = createAsyncThunk(
  'countries/fetchCountriesBySubregion',
  async (subregion) => {
    const response = await getCountriesBySubregion(subregion);
    return response;
  }
);

const countriesSlice = createSlice({
  name: 'countries',
  initialState: {
    countries: [],
    filteredCountries: [],
    loading: false,
    error: null,
    filters: {
      region: '',
      subregion: '',
      search: '',
    },
  },
  reducers: {
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
      state.filteredCountries = state.countries.filter(country => 
        country.name.common.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    clearFilters: (state) => {
      state.filters = { region: '', subregion: '', search: '' };
      state.filteredCountries = state.countries;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload;
        state.filteredCountries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCountriesByRegion.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCountriesByRegion.fulfilled, (state, action) => {
        state.loading = false;
        state.filters.region = action.meta.arg;
        state.filteredCountries = action.payload;
      })
      .addCase(fetchCountriesByRegion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCountriesBySubregion.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCountriesBySubregion.fulfilled, (state, action) => {
        state.loading = false;
        state.filters.subregion = action.meta.arg;
        state.filteredCountries = action.payload;
      })
      .addCase(fetchCountriesBySubregion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchFilter, clearFilters } = countriesSlice.actions;
export default countriesSlice.reducer;