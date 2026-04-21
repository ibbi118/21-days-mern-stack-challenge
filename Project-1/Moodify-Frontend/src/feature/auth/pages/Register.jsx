import React from "react"
"../styles/form.scss"
import { Link,useNavigate } from "react-router"
import { useAuth } from "../hooks/useAuth"
import { useState } from "react"

const Register = () => {
 const [username, setusername] = useState("")
 const [email, setemail] = useState("")
 const [password,setpassword]  = useState("")
 const {handleRegister} = useAuth()
 const navigate = useNavigate()

 async function handleSubmit(e){
  e.preventDefault()
  await handleRegister(username,email,password)
  navigate("/")
 }

  return (
    <div className="form-container">

      <div className="form-card">

        <h2>Register</h2>

        <form onSubmit={handleSubmit}>

          <input 
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e)=>{
              setusername(e.target.value)
            }}
          />

          <input 
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>{
              setemail(e.target.value)
            }}
          />

          <input 
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e)=>{
              setpassword(e.target.value)
            }}
          />

          <button type="submit">
            Register
          </button>

        </form>

        <div className="form-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>

      </div>

    </div>
  )
}

export default Register