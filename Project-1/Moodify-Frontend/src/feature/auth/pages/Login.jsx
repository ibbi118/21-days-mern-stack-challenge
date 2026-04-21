import React, { useState } from "react"
import "../styles/form.scss"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../hooks/useAuth"

const Login = () => {

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const navigate = useNavigate()

  const { handleLogin } = useAuth()

  async function submitHandle(e){
    e.preventDefault()

    await handleLogin( email, password )

    navigate("/")
  }

  return (
    <div className="form-container">

      <div className="form-card">

        <h2>Login</h2>

        <form onSubmit={submitHandle}>

          <input 
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setemail(e.target.value)}
          />

          <input 
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e)=>setpassword(e.target.value)}
          />

          <button type="submit">
            Login
          </button>

        </form>

        <div className="form-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>

      </div>

    </div>
  )
}

export default Login