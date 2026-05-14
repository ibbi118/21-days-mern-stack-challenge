import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const Protected = ({ children }) => {
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)

  // ✅ Show loading first
  if (loading) {
    return <h1>Loading...</h1>
  }

  // ✅ Redirect if no user
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // ✅ Render children if authenticated
  return children
}

export default Protected
