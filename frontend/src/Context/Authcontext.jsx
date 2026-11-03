import React, { createContext } from 'react';

export const AuthUserContext = createContext();

export default function AuthProvider({ children }) {
  const serveruri = import.meta.env.VITE_SERVER_URI ;

  const contextValue = {
    serveruri,
  };

  return (
    <AuthUserContext.Provider value={contextValue}>
      {children}
    </AuthUserContext.Provider>
  );
}