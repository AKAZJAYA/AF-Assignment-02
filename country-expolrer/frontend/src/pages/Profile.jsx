import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiClock } from 'react-icons/fi'

const Profile = () => {
  const { user } = useSelector(state => state.auth)
  const { favorites } = useSelector(state => state.favorites)
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-4">
          <span className="text-3xl text-white font-bold">
            {user?.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">My Profile</h1>
      </motion.div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold mb-4">Account Information</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-10 text-primary flex-shrink-0">
                    <FiUser className="text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Username</p>
                    <p className="font-medium">{user?.username}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-10 text-primary flex-shrink-0">
                    <FiMail className="text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                
                {user?.createdAt && (
                  <div className="flex">
                    <div className="w-10 text-primary flex-shrink-0">
                      <FiClock className="text-xl" />
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Member since</p>
                      <p className="font-medium">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4">Statistics</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{favorites.length}</div>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Favorite Countries</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile