import { useContext, useEffect } from "react";
import { userContext } from "../auth.context";
import { login, register, getMe, logout } from "../services/auth.api";

export function useAuth() {

  const context = useContext(userContext);
  const { user, setuser, loading, setloading } = context;

  async function handleLogin(email, password) {
    setloading(true);

    const response = await login(email, password );

    setuser(response.user);
    setloading(false);
  }

  async function handleRegister(username, email, password) {
    setloading(true);

    const response = await register( username, email, password );

    setuser(response.user);
    setloading(false);
  }

 async function handleGetme() {
    setloading(true);
    try {
      const response = await getMe();
      if (response.user) setuser(response.user);
    } catch (err) {
      setuser(null);
    } finally {
      setloading(false);
    }
  }


  async function handleLogout() {
    setloading(true);

    await logout();

    setuser(null);
    setloading(false);
  }


useEffect(()=>{
  handleGetme()
},[])

  return { handleLogin, handleRegister, handleGetme, handleLogout,user,loading };
}