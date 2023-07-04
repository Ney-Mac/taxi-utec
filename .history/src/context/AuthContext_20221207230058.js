import axios from "axios";
import React, {createContext} from "react";
import {BASE_URL} from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

  const register = (telefone, email, codigo, password) => {
    axios.post(`${BASE_URL}/register`, {
      telefone,
      email,
      codigo,
      password,
    })
    .then(res => {
      let userInfo = res.data;
      console.log(userInfo);
    })
    .catch(e => {
      console.log(`register error ${e}`);
    });
  };


  return (
  <AuthContext.Provider value={{register}}>{children}</AuthContext.Provider>
);
};
