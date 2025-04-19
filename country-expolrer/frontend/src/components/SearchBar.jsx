import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { FiSearch, FiX } from 'react-icons/fi'
import { searchCountries, clearSearchResults, fetchAllCountries } from '../redux/slices/countriesSlice'

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useDispatch()
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      dispatch(searchCountries(searchTerm))
    } else {
      dispatch(fetchAllCountries())
    }
  }
  
  const clearSearch = () => {
    setSearchTerm('')
    dispatch(clearSearchResults())
    dispatch(fetchAllCountries())
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto mb-8"
    >
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-4 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a country..."
            className="input pl-10 pr-10 py-3 w-full shadow-md"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-14 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <FiX className="text-gray-500" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="absolute right-0 top-0 h-full px-4 bg-primary text-white rounded-r-md hover:bg-primary-dark transition-colors"
        >
          Search
        </button>
      </form>
    </motion.div>
  )
}

export default SearchBar