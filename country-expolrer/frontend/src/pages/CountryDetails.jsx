import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiHeart } from 'react-icons/fi'

import { fetchCountryByCode, clearCurrentCountry } from '../redux/slices/countriesSlice'
import { addToFavorites, removeFromFavorites } from '../redux/slices/favoritesSlice'

const CountryDetails = () => {
  const { code } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { currentCountry, status, error } = useSelector(state => state.countries)
  const { isAuthenticated } = useSelector(state => state.auth)
  const { favorites } = useSelector(state => state.favorites)
  
  const isFavorite = favorites.includes(code)
  
  useEffect(() => {
    dispatch(fetchCountryByCode(code))
    
    return () => {
      dispatch(clearCurrentCountry())
    }
  }, [dispatch, code])
  
  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(code))
    } else {
      dispatch(addToFavorites(code))
    }
  }
  
  const formatNumber = (num) => {
    return num.toLocaleString()
  }
  
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  if (status === 'failed') {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-red-500 mb-2">Error</h2>
        <p>{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 btn btn-primary"
        >
          Go back to home
        </button>
      </div>
    )
  }
  
  if (!currentCountry) {
    return null
  }
  
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary flex items-center"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
          
          {isAuthenticated && (
            <button
              onClick={toggleFavorite}
              className={`btn flex items-center ${
                isFavorite 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'btn-secondary'
              }`}
            >
              <FiHeart className={`mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-64 sm:h-96 overflow-hidden rounded-lg shadow-lg"
          >
            <img 
              src={currentCountry.flag} 
              alt={`Flag of ${currentCountry.name}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold mb-6">{currentCountry.name}</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-8">
              <div>
                <p><span className="font-semibold">Population:</span> {formatNumber(currentCountry.population)}</p>
                <p><span className="font-semibold">Region:</span> {currentCountry.region}</p>
                <p><span className="font-semibold">Capital:</span> {currentCountry.capital || 'N/A'}</p>
              </div>
              
              <div>
                <p>
                  <span className="font-semibold">Currencies:</span>{' '}
                  {currentCountry.currencies && currentCountry.currencies.length > 0
                    ? currentCountry.currencies.map(c => c.name).join(', ')
                    : 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">Languages:</span>{' '}
                  {currentCountry.languages && currentCountry.languages.length > 0
                    ? currentCountry.languages.join(', ')
                    : 'N/A'}
                </p>
              </div>
            </div>
            
            {currentCountry.borders && currentCountry.borders.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Border Countries:</h2>
                <div className="flex flex-wrap gap-2">
                  {currentCountry.borders.map(border => (
                    <Link
                      key={border}
                      to={`/country/${border}`}
                      className="px-4 py-1 bg-white dark:bg-gray-800 shadow-md rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {border}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default CountryDetails