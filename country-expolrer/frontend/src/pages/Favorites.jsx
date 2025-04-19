import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHeart, FiInfo, FiGlobe } from 'react-icons/fi'

import CountryGrid from '../components/CountryGrid'
import { fetchAllCountries } from '../redux/slices/countriesSlice'
import { fetchFavorites } from '../redux/slices/favoritesSlice'

const Favorites = () => {
  const dispatch = useDispatch()
  const { countries, status: countriesStatus } = useSelector(state => state.countries)
  const { favorites, status: favoritesStatus } = useSelector(state => state.favorites)
  const { darkMode } = useSelector(state => state.theme)
  
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  }
  
  if (isLoading && favoriteCountries.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] py-16 px-4">
        <div className="relative">
          <div className={`animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 ${
            darkMode
              ? 'border-t-indigo-400 border-r-cyan-300 border-b-teal-300 border-l-blue-400'
              : 'border-t-indigo-500 border-r-cyan-400 border-b-teal-400 border-l-blue-500'
          }`}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <FiGlobe className={`text-${darkMode ? 'indigo-400' : 'indigo-500'} text-xl sm:text-2xl animate-pulse`} />
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8"
    >
      {/* Header Section with Responsive Typography and Spacing */}
      <motion.div
        variants={itemVariants}
        className="text-center mb-6 sm:mb-8 md:mb-10 px-2"
      >
        <motion.div
          whileHover={{ scale: 1.05, rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5 }}
          className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full ${
            darkMode 
              ? 'bg-gradient-to-r from-red-600 to-pink-500' 
              : 'bg-gradient-to-r from-red-500 to-pink-400'
          } mb-4 sm:mb-6 shadow-lg`}
        >
          <FiHeart className="text-3xl sm:text-4xl text-white" />
        </motion.div>
        
        <motion.h1
          variants={itemVariants}
          className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent ${
            darkMode
              ? 'bg-gradient-to-r from-red-400 to-pink-300'
              : 'bg-gradient-to-r from-red-600 to-pink-500'
          }`}
        >
          Your Favorite Countries
        </motion.h1>
        
        <motion.p
          variants={itemVariants} 
          className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-md sm:max-w-xl md:max-w-2xl mx-auto leading-relaxed"
        >
          View and manage the countries you've saved for future exploration and reference.
        </motion.p>
      </motion.div>
      
      {/* Responsive Empty State with Adaptive Sizing */}
      <AnimatePresence>
        {!isLoading && favoriteCountries.length === 0 && (
          <motion.div
            variants={itemVariants}
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-xl shadow-lg p-6 sm:p-8 md:p-10 text-center max-w-xs sm:max-w-md md:max-w-lg mx-auto border ${
              darkMode ? 'border-gray-700' : 'border-gray-100'
            }`}
          >
            <div className="relative mb-6">
              <div className={`absolute inset-0 rounded-full ${
                darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100/70'
              } blur-xl transform -translate-y-4 scale-125`}></div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <FiInfo className="text-4xl sm:text-5xl mx-auto text-gray-400" />
              </motion.div>
            </div>
            
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3"
            >
              No favorites yet
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-sm mx-auto"
            >
              Start exploring countries and add them to your favorites to build your collection!
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/" 
                className={`inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base font-medium rounded-full shadow-lg ${
                  darkMode
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:from-indigo-700 hover:to-cyan-700'
                    : 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:from-indigo-600 hover:to-cyan-600'
                } transition-all duration-300`}
              >
                <FiGlobe className="mr-2" />
                Explore Countries
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Responsive Country Grid with Adaptive Container */}
      {favoriteCountries.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="container mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8"
        >
          <CountryGrid countries={favoriteCountries} />
        </motion.div>
      )}
      
      {/* Background Decorative Elements - Visible on larger screens */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className={`hidden lg:block absolute top-20 left-20 w-32 h-32 rounded-full ${
          darkMode ? 'bg-red-900/10' : 'bg-red-500/10'
        } blur-3xl opacity-60`}></div>
        
        <div className={`hidden lg:block absolute bottom-40 right-20 w-40 h-40 rounded-full ${
          darkMode ? 'bg-indigo-900/10' : 'bg-indigo-500/10'
        } blur-3xl opacity-60`}></div>
      </div>
    </motion.div>
  )
}

export default Favorites