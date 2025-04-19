import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import CountryCard from './CountryCard'

const CountryGrid = ({ countries }) => {
  const [visibleCountries, setVisibleCountries] = useState([])
  const [page, setPage] = useState(1)
  const countriesPerPage = 12
  
  useEffect(() => {
    setPage(1)
    setVisibleCountries(countries.slice(0, countriesPerPage))
  }, [countries])
  
  const loadMore = () => {
    const nextPage = page + 1
    const startIndex = page * countriesPerPage
    const endIndex = startIndex + countriesPerPage
    
    setVisibleCountries([...visibleCountries, ...countries.slice(startIndex, endIndex)])
    setPage(nextPage)
  }
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  return (
    <div className="space-y-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {visibleCountries.map(country => (
          <CountryCard key={country.alpha3Code} country={country} />
        ))}
      </motion.div>
      
      {visibleCountries.length < countries.length && (
        <div className="flex justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadMore}
            className="btn btn-primary px-8"
          >
            Load More
          </motion.button>
        </div>
      )}
    </div>
  )
}

export default CountryGrid