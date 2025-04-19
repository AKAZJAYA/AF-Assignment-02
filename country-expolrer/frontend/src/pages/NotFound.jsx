import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiAlertCircle } from 'react-icons/fi'

const NotFound = () => {
  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900 mb-6">
          <FiAlertCircle className="text-4xl text-red-500 dark:text-red-300" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/" className="btn btn-primary px-8 py-3">
          Go to Home
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound