import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ allowedRole, children }) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  // 1. If not authenticated, prevent access and redirect to common login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 2. If user is authenticated with a different role, block unauthorized portal route
  // and redirect to their assigned dashboard
  if (allowedRole && role !== allowedRole) {
    if (role === 'officer') {
      return <Navigate to="/officer/dashboard" replace />
    } else if (role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    } else {
      return <Navigate to="/institution/dashboard" replace />
    }
  }

  return children
}

