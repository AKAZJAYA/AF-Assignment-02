import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = () => {
  const { isAuthenticated, status } = useSelector(state => state.auth)
  
  // If auth status is still loading, show nothing
  if (status === 'loading') {
    return null
  }
  
  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  // If user is authenticated, render child routes
  return <Outlet />
}

export default ProtectedRoute