import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'http://localhost:5050/api/countries'

// Async thunks
export const fetchAllCountries = createAsyncThunk(
  'countries/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch countries' })
    }
  }
)

export const fetchCountryByCode = createAsyncThunk(
  'countries/fetchByCode',
  async (countryCode, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${countryCode}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch country details' })
    }
  }
)

export const searchCountries = createAsyncThunk(
  'countries/search',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/search/${searchTerm}`)
      return response.data
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return []
      }
      return rejectWithValue(error.response?.data || { message: 'Search failed' })
    }
  }
)

const initialState = {
  countries: [],
  currentCountry: null,
  searchResults: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
}

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    clearCurrentCountry: (state) => {
      state.currentCountry = null
    },
    clearSearchResults: (state) => {
      state.searchResults = []
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchAllCountries cases
      .addCase(fetchAllCountries.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchAllCountries.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.countries = action.payload
        state.error = null
      })
      .addCase(fetchAllCountries.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.message || 'Failed to fetch countries'
      })
      // fetchCountryByCode cases
      .addCase(fetchCountryByCode.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCountryByCode.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.currentCountry = action.payload
        state.error = null
      })
      .addCase(fetchCountryByCode.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.message || 'Failed to fetch country details'
      })
      // searchCountries cases
      .addCase(searchCountries.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(searchCountries.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.searchResults = action.payload
        state.error = null
      })
      .addCase(searchCountries.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.message || 'Search failed'
      })
  }
})

export const { clearCurrentCountry, clearSearchResults } = countriesSlice.actions

export default countriesSlice.reducer