import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/auth'

// Set up axios with token
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token
  } else {
    delete axios.defaults.headers.common['x-auth-token']
  }
}

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData)
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.token)
      setAuthToken(response.data.token)
      
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData)
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.token)
      setAuthToken(response.data.token)
      
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    // Set auth token
    const token = localStorage.getItem('token')
    setAuthToken(token)
    
    try {
      const response = await axios.get('http://localhost:5000/api/users/profile')
      return response.data
    } catch (error) {
      // Clear token on error
      localStorage.removeItem('token')
      return rejectWithValue(error.response.data)
    }
  }
)

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  user: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token')
      state.token = null
      state.isAuthenticated = false
      state.user = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.isAuthenticated = true
        state.user = action.payload.user
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.message || 'Registration failed'
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.isAuthenticated = true
        state.user = action.payload.user
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.message || 'Login failed'
      })
      // Load user cases
      .addCase(loadUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(loadUser.rejected, (state) => {
        state.status = 'failed'
        state.token = null
        state.isAuthenticated = false
        state.user = null
      })
  }
})

export const { logout, clearError } = authSlice.actions

export default authSlice.reducer