import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { FiHeart } from 'react-icons/fi'
import { addToFavorites, removeFromFavorites } from '../redux/slices/favoritesSlice'

const CountryCard = ({ country }) => {
  const { isAuthenticated } = useSelector(state => state.auth)
  const { favorites } = useSelector(state => state.favorites)
  const dispatch = useDispatch()
  
  const isFavorite = favorites.includes(country.alpha3Code)
  
  const toggleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isFavorite) {
      dispatch(removeFromFavorites(country.alpha3Code))
    } else {
      dispatch(addToFavorites(country.alpha3Code))
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="card"
    >
      <Link to={`/country/${country.alpha3Code}`} className="block h-full">
        <div className="relative h-40 overflow-hidden">
          <img 
            src={country.flag} 
            alt={`Flag of ${country.name}`}
            className="w-full h-full object-cover"
          />
          {isAuthenticated && (
            <button 
              onClick={toggleFavorite}
              className={`absolute top-3 right-3 p-2 rounded-full ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiHeart className={isFavorite ? 'fill-current' : ''} />
            </button>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{country.name}</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Population:</span> {country.population.toLocaleString()}</p>
            <p><span className="font-medium">Region:</span> {country.region}</p>
            <p><span className="font-medium">Capital:</span> {country.capital || 'N/A'}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default CountryCard