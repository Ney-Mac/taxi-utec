import React, { createContext, useState } from "react";
import { BASE_URL } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onSignUpPressed = (telefone, email, codigo, password) => {
    axios.post(`${BASE_URL}/RegisterScreen`, {
      telefone, email, codigo, password
    }).then(res => {
      let userInfo = res.data;
      console.log(userInfo);
    }).catch(e => {
      console.log(`Ops..!! Aconteceu um erro ao registrar-se ${e}.`);
    });
  };

  return (
  <AuthContext.Provider value={{onSignUpPressed}}>{children}</AuthContext.Provider>
 );
};