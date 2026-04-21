import { createContext, useState } from "react";

export const userContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setuser] = useState(null);
  const [loading, setloading] = useState(true); // initially true

  return (
    <userContext.Provider value={{ user, setuser, loading, setloading }}>
      {children}
    </userContext.Provider>
  );
};