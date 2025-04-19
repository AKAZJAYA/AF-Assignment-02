import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { FiGlobe } from 'react-icons/fi'

import SearchBar from '../components/SearchBar'
import RegionFilter from '../components/RegionFilter'
import CountryGrid from '../components/CountryGrid'
import { fetchAllCountries } from '../redux/slices/countriesSlice'

const Home = () => {
  const dispatch = useDispatch()
  const { countries, searchResults, status, error } = useSelector(state => state.countries)
  const [selectedRegion, setSelectedRegion] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])
  
  // Get unique regions from countries
  const regions = [...new Set(countries.map(country => country.region).filter(Boolean))].sort()
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllCountries())
    }
  }, [status, dispatch])
  
  useEffect(() => {
    const countriesToFilter = searchResults.length > 0 ? searchResults : countries
    
    if (selectedRegion) {
      setFilteredCountries(countriesToFilter.filter(country => country.region === selectedRegion))
    } else {
      setFilteredCountries(countriesToFilter)
    }
  }, [countries, searchResults, selectedRegion])
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light mb-4">
          <FiGlobe className="text-3xl text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Explore Countries Around the World</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover information about countries, their flags, populations, and more.
        </p>
      </motion.div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <SearchBar />
        <RegionFilter 
          regions={regions} 
          selectedRegion={selectedRegion} 
          onRegionChange={setSelectedRegion} 
        />
      </div>
      
      {status === 'loading' && countries.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
      
      {status === 'failed' && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Error</h2>
          <p>{error}</p>
        </div>
      )}
      
      {status !== 'loading' && filteredCountries.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No countries found</h2>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
      
      {filteredCountries.length > 0 && (
        <CountryGrid countries={filteredCountries} />
      )}
    </div>
  )
}

export default Home