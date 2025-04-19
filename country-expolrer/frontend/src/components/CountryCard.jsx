import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { FiHeart, FiInfo } from 'react-icons/fi'
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
  
  // Card flip animation
  const cardVariants = {
    hover: {
      rotateY: 10,
      rotateX: 10,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      variants={cardVariants}
      whileHover="hover"
      className="card group"
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      <Link to={`/country/${country.alpha3Code}`} className="block h-full">
        <div className="relative h-40 overflow-hidden">
          <motion.img 
            src={country.flag} 
            alt={`Flag of ${country.name}`}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {isAuthenticated && (
            <motion.button 
              onClick={toggleFavorite}
              whileTap={{ scale: 0.9 }}
              className={`absolute top-3 right-3 p-2 rounded-full ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } shadow-md transition-all duration-300`}
            >
              <FiHeart className={`${isFavorite ? 'fill-current' : ''} transition-all duration-300`} />
            </motion.button>
          )}
          
          <motion.div 
            className="absolute bottom-0 left-0 w-full py-1 px-3 bg-gradient-to-t from-black/70 to-transparent text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
            initial={{ y: "100%" }}
            whileHover={{ y: 0 }}
          >
            <div className="flex items-center text-xs">
              <FiInfo className="mr-1" /> Click for details
            </div>
          </motion.div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">{country.name}</h3>
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