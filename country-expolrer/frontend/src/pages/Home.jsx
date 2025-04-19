import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { FiGlobe, FiMapPin, FiSearch, FiCompass } from 'react-icons/fi'
import { BiWorld } from 'react-icons/bi'
import { IoEarthOutline } from 'react-icons/io5'
import confetti from 'canvas-confetti'

import SearchBar from '../components/SearchBar'
import RegionFilter from '../components/RegionFilter'
import CountryGrid from '../components/CountryGrid'
import { fetchAllCountries } from '../redux/slices/countriesSlice'

const Home = () => {
  const dispatch = useDispatch()
  const { countries, searchResults, status, error } = useSelector(state => state.countries)
  const [selectedRegion, setSelectedRegion] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])
  const [showConfetti, setShowConfetti] = useState(false)
  const heroRef = useRef(null)

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 250])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  // Get unique regions from countries
  const regions = [...new Set(countries.map(country => country.region).filter(Boolean))].sort()

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllCountries())
    }
  }, [status, dispatch])

  useEffect(() => {
    // Show confetti when countries are loaded
    if (status === 'succeeded' && countries.length > 0 && !showConfetti) {
      const duration = 2000
      const end = Date.now() + duration
      
      const runConfetti = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#4F46E5', '#3B82F6', '#60A5FA', '#2DD4BF', '#14B8A6']
        })
        
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#4F46E5', '#3B82F6', '#60A5FA', '#2DD4BF', '#14B8A6']
        })
        
        if (Date.now() < end) {
          requestAnimationFrame(runConfetti)
        }
      }
      
      runConfetti()
      setShowConfetti(true)
    }
  }, [status, countries, showConfetti])

  useEffect(() => {
    const countriesToFilter = searchResults.length > 0 ? searchResults : countries

    if (selectedRegion) {
      setFilteredCountries(countriesToFilter.filter(country => country.region === selectedRegion))
    } else {
      setFilteredCountries(countriesToFilter)
    }
  }, [countries, searchResults, selectedRegion])

  // 3D card hover effect
  const cardVariants = {
    hover: {
      rotateY: 5,
      rotateX: 5,
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-800">
      {/* Hero Section with Parallax Effect */}
      <div ref={heroRef} className="relative overflow-hidden">
        <motion.div
          style={{ y, opacity, scale }}
          className="absolute inset-0 -z-10 opacity-20"
        >
          <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-blue-300 to-cyan-200 blur-3xl"></div>
          <div className="absolute top-40 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-300 to-purple-200 blur-3xl"></div>
          <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-200 to-teal-200 blur-3xl"></div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center py-24 sm:py-32 px-4"
        >
          <motion.div 
            whileHover={{ rotate: [0, 5, -5, 0], transition: { duration: 1, repeat: Infinity } }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 mb-8 shadow-lg shadow-indigo-300/30"
          >
            <IoEarthOutline className="text-5xl text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-5xl sm:text-6xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore Countries Around the World
          </motion.h1>
          
          <motion.p 
            className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Discover detailed information about countries, their flags, populations, and more.
          </motion.p>
          
          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.div 
              className="flex items-center bg-white bg-opacity-80 backdrop-blur-sm py-3 px-5 rounded-xl shadow-xl shadow-indigo-100"
              variants={cardVariants}
              whileHover="hover"
            >
              <FiMapPin className="text-2xl text-indigo-500 mr-3" />
              <span>200+ Countries</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center bg-white bg-opacity-80 backdrop-blur-sm py-3 px-5 rounded-xl shadow-xl shadow-indigo-100"
              variants={cardVariants}
              whileHover="hover"
            >
              <FiCompass className="text-2xl text-cyan-500 mr-3" />
              <span>Detailed Information</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center bg-white bg-opacity-80 backdrop-blur-sm py-3 px-5 rounded-xl shadow-xl shadow-indigo-100"
              variants={cardVariants}
              whileHover="hover"
            >
              <BiWorld className="text-2xl text-teal-500 mr-3" />
              <span>Interactive Experience</span>
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-6xl"
        >
          <svg className="w-full" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 64L48 64C96 64 192 64 288 58.7C384 53 480 43 576 48.3C672 53 768 75 864 74.7C960 75 1056 53 1152 42.7C1248 32 1344 32 1392 32L1440 32V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V64Z" fill="white"/>
          </svg>
        </motion.div>
      </div>

      {/* Content Section with White Background */}
      <div className="bg-white pt-20 pb-24 px-4 relative">
        {/* Floating elements */}
        <div className="hidden md:block absolute top-40 left-10 w-16 h-16 rounded-lg bg-gradient-to-r from-indigo-400 to-blue-300 opacity-20 animate-float"></div>
        <div className="hidden md:block absolute bottom-20 right-20 w-20 h-20 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-300 opacity-20 animate-float-delay"></div>
        
        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center mb-16"
        >
          <SearchBar />
          <RegionFilter
            regions={regions}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
          />
        </motion.div>

        {/* Loading State */}
        {status === 'loading' && countries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center py-32"
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-indigo-500 border-r-cyan-400 border-b-teal-400 border-l-blue-500"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <FiGlobe className="text-indigo-500 text-2xl animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {status === 'failed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-24 px-4"
          >
            <motion.div 
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6"
            >
              <span className="text-red-500 text-3xl">!</span>
            </motion.div>
            <h2 className="text-2xl font-semibold text-red-500 mb-4">Oops! Something went wrong</h2>
            <p className="text-lg text-gray-600 max-w-lg mx-auto">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(fetchAllCountries())}
              className="mt-8 px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-full font-medium shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300/40 transition-all duration-300"
            >
              Try Again
            </motion.button>
          </motion.div>
        )}

        {/* No Results State */}
        <AnimatePresence>
          {status !== 'loading' && filteredCountries.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center py-24 px-4"
            >
              <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-6"
              >
                <FiSearch className="text-3xl text-indigo-500" />
              </motion.div>
              <h2 className="text-2xl font-semibold mb-4 text-indigo-700">No countries found</h2>
              <p className="text-lg text-gray-600 max-w-lg mx-auto">
                Try adjusting your search or filter criteria
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedRegion('')
                  dispatch(fetchAllCountries())
                }}
                className="mt-8 px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-full font-medium shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300/40 transition-all duration-300"
              >
                Reset Filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Country Grid */}
        <AnimatePresence>
          {filteredCountries.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="container mx-auto px-4 sm:px-6 lg:px-8"
            >
              <CountryGrid countries={filteredCountries} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Home