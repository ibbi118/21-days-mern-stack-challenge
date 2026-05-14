import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/usechat'


const Dashboard = () => {
  const {user} = useSelector((state)=>state.auth)
  console.log(user)
  const chat = useChat()
  useEffect(()=>{
    chat.initializeSocketConnection()
  },[])
  
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard