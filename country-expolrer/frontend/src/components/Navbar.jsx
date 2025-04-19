import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { FiMenu, FiX, FiMoon, FiSun, FiLogOut, FiUser, FiHeart, FiHome } from 'react-icons/fi'

import { logout } from '../redux/slices/authSlice'
import { toggleDarkMode } from '../redux/slices/themeSlice'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const { darkMode } = useSelector(state => state.theme)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
            >
              <FiHome className="text-white text-xl" />
            </motion.div>
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-xl font-bold"
            >
              Country Explorer
            </motion.h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-lg hover:text-primary-light transition-colors">Home</Link>
            {isAuthenticated ? (
              <>
                <Link to="/favorites" className="text-lg hover:text-primary-light transition-colors">Favorites</Link>
                <Link to="/profile" className="text-lg hover:text-primary-light transition-colors">Profile</Link>
                <button 
                  onClick={handleLogout}
                  className="text-lg hover:text-primary-light transition-colors flex items-center"
                >
                  <FiLogOut className="mr-1" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-lg hover:text-primary-light transition-colors">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
            <button 
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-4 py-2"
          >
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <FiHome className="mr-2" /> Home
              </Link>
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/favorites" 
                    className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiHeart className="mr-2" /> Favorites
                  </Link>
                  <Link 
                    to="/profile" 
                    className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiUser className="mr-2" /> Profile
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="px-3 py-2 text-left rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <FiLogOut className="mr-2" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-3 py-2 bg-primary text-white rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
              <button 
                onClick={() => {
                  dispatch(toggleDarkMode());
                  setIsOpen(false);
                }}
                className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                {darkMode ? <FiSun className="mr-2" /> : <FiMoon className="mr-2" />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default Navbar