import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiInfo } from 'react-icons/fi'

import CountryGrid from '../components/CountryGrid'
import { fetchAllCountries } from '../redux/slices/countriesSlice'
import { fetchFavorites } from '../redux/slices/favoritesSlice'

const Favorites = () => {
  const dispatch = useDispatch()
  const { countries, status: countriesStatus } = useSelector(state => state.countries)
  const { favorites, status: favoritesStatus } = useSelector(state => state.favorites)
  
  useEffect(() => {
    if (countriesStatus === 'idle') {
      dispatch(fetchAllCountries())
    }
    
    dispatch(fetchFavorites())
  }, [dispatch, countriesStatus])
  
  // Filter countries to show only favorites
  const favoriteCountries = countries.filter(country => 
    favorites.includes(country.alpha3Code)
  )
  
  const isLoading = countriesStatus === 'loading' || favoritesStatus === 'loading'
  
  if (isLoading && favoriteCountries.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-400 mb-4">
          <FiHeart className="text-3xl text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Favorite Countries</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          View and manage the countries you've saved.
        </p>
      </motion.div>
      
      {!isLoading && favoriteCountries.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center max-w-lg mx-auto"
        >
          <FiInfo className="text-5xl mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start exploring countries and add them to your favorites!
          </p>
          <Link to="/" className="btn btn-primary">
            Explore Countries
          </Link>
        </motion.div>
      )}
      
      {favoriteCountries.length > 0 && (
        <CountryGrid countries={favoriteCountries} />
      )}
    </div>
  )
}

export default Favorites