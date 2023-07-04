import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState } from "react";
import { BASE_URL } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const register = (telefone, email, codigo, password) => {
    axios.post(`${BASE_URL}/RegisterScreen`, {
      telefone, email, codigo, password
    }).then(res => {
      let userInfo = res.data;
      setUserInfo(userInfo);
      AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      setIsLoading(false)
      console.log(userInfo);
    }).catch(e => {
      console.log(`Ops..!! Aconteceu um erro ao registrar-se ${e}.`);
    });
  };

  return (
  <AuthContext.Provider value={{isLoading,userInfo,register}}>{children}</AuthContext.Provider>
 );
};