import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { BASE_URL } from '../config';
import { showMessage } from "react-native-flash-message";
import { getStatusBarHeight } from "react-native-status-bar-height";

export const AuthContext = createContext(); //cria um novo contexto

export const AuthProvider = ({ children }) => {
	const [userInfo, setUserInfo] = useState(false);
	const [isLoading, setIsLoading] = useState(false); //esta carregando
	const [splashLoading, setSplashLoading] = useState(false); //carregamento inicial
	const [isLog, setIsLog] = useState(false);

	const preRegister = async (name, email, telefone, password) => {
		setIsLoading(true);

		try {
			const res = await axios({
				url: `${BASE_URL}user/pre-register`,
				method: 'post',
				data: {
					name,
					email,
					telefone,
					password,
					role: 'user',
				}
			});
			console.log(res.data);
			setUserInfo({ name, email, telefone, password });

			setIsLoading(false);

			showMessage({
				message: 'Código de validação',
				description: 'Verifique sua caixa de mensagens',
				type: 'info',
				duration: 4000,
				statusBarHeight: getStatusBarHeight(),
			})

			return true;
		} catch (e) {
			console.log(`register error ${e}`);

			showMessage({
				message: "Falha de registo",
				description: e.response ? 'Email ou número já está registado' : 'Está sem conexão a internet',
				type: "danger",
				duration: 4000,
				autoHide: true,
				statusBarHeight: getStatusBarHeight(),
			});

			setIsLoading(false);
			return false;
		}
	}

	const finalRegister = async (code, phone) => {
		setIsLoading(true);

		try {
			const res = await axios.post(`${BASE_URL}user/final-register`, {
				verification_code: code,
				telefone: phone,
			});
			console.log(res.data.data);

			let user = res.data.data;

			setUserInfo(user);
			AsyncStorage.setItem('userInfo', JSON.stringify(user));

			setIsLog(true);
			setIsLoading(false);
		} catch (e) {
			console.log(e);

			showMessage({
				message: "Falha de registo",
				description: e.response ? e.response.data.message : 'Está sem conexão a internet',
				type: "danger",
				duration: 4000,
				autoHide: true,
				statusBarHeight: getStatusBarHeight(),
			});

			setIsLoading(false);
		}
	}

	const login = (login, password) => { //Logar usuario

		setIsLoading(true);

		axios({
			url: `${BASE_URL}user/login`,
			method: 'post',
			params: {
				login,
				password,
			}
		})
			.then(res => {
				let userInfo = res.data.data;
				console.log(userInfo);

				setUserInfo(userInfo);
				AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

				setIsLog(true);
				setIsLoading(false);
			}).catch(e => {
				console.log(`login error ${e}`);

				showMessage({
					message: "Falha na validação",
					description: e.response ? e.response.data.message : 'Está sem conexão a internet',
					type: "danger",
					duration: 4000,
					autoHide: true,
					statusBarHeight: getStatusBarHeight(),
				});

				setIsLoading(false);
			});
	};

	const logout = () => {//deslogar usuario
		setIsLoading(true);

		axios({
			url: `${BASE_URL}logout`,
			method: 'post',
			headers: {
				Authorization: `Bearer ${userInfo.accessToken}` //${userInfo.accessToken}`,
			},
			params: {
				token: userInfo.accessToken,//userInfo.accessToken,
			}
		}).then(res => {
			AsyncStorage.removeItem('userInfo');
			setIsLog(false);
			setUserInfo(false);
			setIsLoading(false);
		}).catch(e => {
			console.log(`logout error ${e}`);

			showMessage({
				message: "Falha no pedido",
				description: e.response ? e.response.data.message : 'Está sem conexão a internet',
				type: "danger",
				duration: 4000,
				autoHide: true,
				statusBarHeight: getStatusBarHeight(),
			});

			setIsLoading(false);
		});
	};

	const isLoggedIn = async () => {
		try {
			setSplashLoading(true);

			let userInfo = await AsyncStorage.getItem('userInfo');
			userInfo = JSON.parse(userInfo);

			if (userInfo) {
				setUserInfo(userInfo);
				setIsLog(true);
			}

			setSplashLoading(false);
		} catch (e) {
			setSplashLoading(false);
			console.log(`is logged in error ${e.response.data}`);

			showMessage({
				message: "Erro de conexão da rede",
				description: e.response ? e.response.data : 'Está sem conexão a internet',
				type: 'danger',
				duration: 4000,
				autoHide: true,
				statusBarHeight: getStatusBarHeight(),
			});
		}
	};

	const sendCodeForNewPhoneNumber = async (telefone) => {//Envia codigo de verificacao de numero de telefone
		setIsLoading(true);

		try {
			const res = await axios({
				url: `${BASE_URL}user/send-code`,
				method: 'post',
				headers: {
					Authorization: `Bearer ${userInfo.accessToken}`//${userInfo.accessToken}`,
				},
				data: {
					telefone: userInfo.user.telefone,
					natureza: 'alteracao',
				}
			});

			console.log(res.data);

			showMessage({
				message: 'Actualizar número de telefone',
				description: res.data.message,
				type: 'info',
				duration: 8000,
				statusBarHeight: getStatusBarHeight(),
			});

			setIsLoading(false);
			return true;
		} catch (e) {
			console.log(`sendCodeForNewPhoneNumber error ${e}`);

			showMessage({
				message: 'Meu perfil',
				description: e.response ? e.response.data.message : 'Está sem conexão a internet',
				type: 'danger',
				duration: 4000,
				statusBarHeight: getStatusBarHeight(),
			});

			setIsLoading(false);
			return false;
		}
	}

	const resetUserData = async (name, email, endereco) => {
		setIsLoading(true);

		try {

			const res = await axios({//Esta rota altera nome, email e endereco
				url: `${BASE_URL}user/actualizar-my-perfil`,
				method: 'put',
				headers: {
					Authorization: `Bearer ${userInfo.accessToken}`
				},
				data: {
					name,
					email,
					endereco,
				}
			});
			console.log(res.data.data);

			showMessage({
				message: 'Perfíl',
				description: res.data.message,
				type: 'success',
				duration: 4000,
				statusBarHeight: getStatusBarHeight(),
			})

			userInfo.user = res.data.data;

			AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

			setIsLoading(false);
		} catch (e) {
			console.log(`restUserData error ${e}`);

			showMessage({
				message: 'Meu perfil',
				description: e.response ? e.response.data.message : 'Está sem conexão a internet',
				type: 'danger',
				duration: 4000,
				statusBarHeight: getStatusBarHeight(),
			});

			setIsLoading(false);
		}
	}

	useEffect(() => {
		isLoggedIn();
	}, []);

	return (
		<AuthContext.Provider value={{ sendCodeForNewPhoneNumber, resetUserData, isLog, isLoading, userInfo, isLoggedIn, splashLoading, preRegister, finalRegister, login, logout }}>{children}</AuthContext.Provider>
	);
};
