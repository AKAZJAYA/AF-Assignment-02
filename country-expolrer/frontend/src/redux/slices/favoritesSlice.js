import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/users'

// Async thunks
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/favorites`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const addToFavorites = createAsyncThunk(
  'favorites/add',
  async (countryCode, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/favorites`, { countryCode })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const removeFromFavorites = createAsyncThunk(
  'favorites/remove',
  async (countryCode, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/favorites/${countryCode}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const initialState = {
  favorites: [],
  status: 'idle',
  error: null
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = []
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchFavorites cases
      .addCase(fetchFavorites.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.favorites = action.payload
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.message || 'Failed to fetch favorites'
      })
      // addToFavorites cases
      .addCase(addToFavorites.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.favorites = action.payload.favorites
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.message || 'Failed to add to favorites'
      })
      // removeFromFavorites cases
      .addCase(removeFromFavorites.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.favorites = action.payload.favorites
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.message || 'Failed to remove from favorites'
      })
  }
})

export const { clearFavorites } = favoritesSlice.actions

export default favoritesSlice.reducer