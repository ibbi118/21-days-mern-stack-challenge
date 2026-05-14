import React from 'react'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes'
import { useEffect } from 'react'
import useAuth from '../feature/auth/hooks/authhook'
import { useSelector } from 'react-redux'


const App = () => {
  const auth = useAuth()
  useEffect(()=>{
   auth.handleGetMe()
   
  },[])


  return (
    <RouterProvider router={routes}/>
  )
}

export default App