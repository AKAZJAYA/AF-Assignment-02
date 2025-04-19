import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'

const RegionFilter = ({ regions, selectedRegion, onRegionChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="relative z-10"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 bg-white dark:bg-gray-800 shadow-md rounded-md flex items-center justify-between min-w-[200px]"
      >
        <span>{selectedRegion || 'Filter by Region'}</span>
        <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden"
        >
          <ul>
            <li
              onClick={() => {
                onRegionChange('')
                setIsOpen(false)
              }}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              All Regions
            </li>
            {regions.map(region => (
              <li
                key={region}
                onClick={() => {
                  onRegionChange(region)
                  setIsOpen(false)
                }}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                {region}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  )
}

export default RegionFilter