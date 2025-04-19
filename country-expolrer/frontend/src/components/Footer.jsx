import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi'

const Footer = () => {
  const { darkMode } = useSelector(state => state.theme)

  return (
    <footer className={`py-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-inner`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left mb-4 md:mb-0"
          >
            <h2 className="text-lg font-semibold">Country Explorer</h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Discover the world, one country at a time
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center space-x-4"
          >
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-primary transition-colors">
              <FiGithub />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-primary transition-colors">
              <FiTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-primary transition-colors">
              <FiLinkedin />
            </a>
          </motion.div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            &copy; {new Date().getFullYear()} Country Explorer. All rights reserved.
          </p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Powered by <a href="https://restcountries.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">REST Countries API</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer