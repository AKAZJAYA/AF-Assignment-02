import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AnimatePresence } from 'framer-motion'

// Pages
import Home from './pages/Home'
import CountryDetails from './pages/CountryDetails'
import Favorites from './pages/Favorites'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

// Components
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Redux actions
import { loadUser } from './redux/slices/authSlice'

const App = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(loadUser())
    }
  }, [dispatch])

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="country/:code" element={<CountryDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="favorites" element={<Favorites />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App
