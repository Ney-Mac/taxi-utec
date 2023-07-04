import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { BASE_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);

  const register = (telefone, email, codigo, password) => {
    setIsLoading(true);

    axios.post(`${BASE_URL}/auth/register`, {
      telefone,
      email,
      codigo,
      password,
    })
      .then(res => {
        let userInfo = res.data;
        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setIsLoading(false);
        console.log(userInfo);
      })
      .catch(e => {
        console.log(`register error ${e}`);
        setIsLoading(false);
      });
  };

  const login = (telefone, password) => {
    setIsLoading(true);

    axios.post(`${BASE_URL}/auth/login`, {
      telefone, password,
    }).then(res => {
      let userInfo = res.data;
      console.log(userInfo);
      setUserInfo(userInfo);
      AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      setIsLoading(false);
    }).catch(e => {
      console.log(`login error ${e}`);
      setIsLoading(false);
    });
  };

  const logout = () => {
    setIsLoading(true);

    axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${userInfo}` },
    },
    ).then(res => {
      console.log(res.data);
      AsyncStorage.removeItem('userInfo');
      setUserInfo({});
      setIsLoading(false);
    })
      .catch(e => {
        console.log(`logout error ${e}`);
        setIsLoading(false);
      });
  };

  const isLoggeIn = async () => {
    try {
      setSplashLoading(true);

      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setUserInfo(userInfo);
      }

      setSplashLoading(false);
    } catch (e) {
      setSplashLoading(false);
      console.log(`is logged in error ${e}`);
    }
  };

  useEffect(() => {
    isLoggeIn();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, userInfo, isLoggeIn, splashLoading, register, login, logout }}>{children}</AuthContext.Provider>
  );
};
