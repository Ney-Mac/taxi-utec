import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import { AuthContext } from "./AuthContext";
import { showMessage } from "react-native-flash-message";
import { getStatusBarHeight } from "react-native-status-bar-height";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const MapContext = createContext();

export const MapProvider = ({ children }) => {
	const { userInfo } = useContext(AuthContext);

	const [controle, setControle] = useState(false);

	const [pontos, setPontos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [filterEndLoading, setFilterEndLoading] = useState(false);

	const [savedPontoTimer, setSavedPontoTimer] = useState(null);

	const getPontos = (filter) => {
		console.log(BASE_URL)

		setIsLoading(true);
		axios({// retorna array de objs
			method: 'get',
			url: `${BASE_URL}listar-pontos`,
			headers: {
				Authorization: `Bearer ${userInfo.accessToken}`
			},
			params: {
				status: 1,
				type: filter,
				enabled: 1,
			}
		}).then(res => {
			let points = res.data.data

			console.log(points);
			setPontos(points);

			setFilterEndLoading(true);
			setControle(!controle);

			setTimeout(() => {
				setFilterEndLoading(false);
			}, 500);

			setIsLoading(false);
		}).catch(e => {
			console.log(`getPontos error ${e}`);
			console.log(e.response?.data.message);

			showMessage({
				message: `Erro ao buscar pontos`,
				description: e.response ? e.response.data.message : 'Está sem conexão a internet',
				duration: 4000,
				autoHide: true,
				type: 'danger',
				statusBarHeight: getStatusBarHeight(),
			});
			setIsLoading(false);
		});
	}

	const saveChangePontoTimer = async (date) => {
		try {
			let savedTime = await AsyncStorage.getItem('savedPontoTimer');
			savedTime = JSON.parse(savedTime);

			if (!savedTime) {
				AsyncStorage.setItem('savedPontoTimer', JSON.stringify([date]));
			} else {
				savedTime.push(date);
				AsyncStorage.setItem('savedPontoTimer', JSON.stringify(savedTime));
			}
		} catch (e) {
			console.log(`saveChangePontoTimer error ${e}`);
		}
	}

	const loadSavedPontoTimer = async () => {
		try {
			const timesLoaded = [];

			let savedTimes = await AsyncStorage.getItem('savedPontoTimer');
			savedTimes = JSON.parse(savedTimes);

			if (savedTimes) {
				savedTimes.map((savedTime, index) => {
					let actualDate = new Date();

					if (savedTime.min > actualDate.getMinutes()) {//min salvo > min actual
						if (savedTime.hora == actualDate.getHours()) {
							savedTimes.splice(index, 1);
							return;
						}

						let past = (59 - savedTime.min) + actualDate.getMinutes();
						if (past >= 29) {
							savedTimes.splice(index, 1);
							return;
						}

						timesLoaded.push({
							min: 29 - past,
							sec: savedTime.sec,
							id: savedTime.idPonto,
						});

					} else if (savedTime.min <= actualDate.getMinutes()) {//min salvo < min actual
						if (savedTime.hora != actualDate.getHours()) {
							savedTimes.splice(index, 1);
							return;
						}

						let past = actualDate.getMinutes() - savedTime.min;
						if (past >= 29) {
							savedTimes.splice(index, 1);
							return;
						}

						timesLoaded.push({
							min: 29 - past,
							sec: savedTime.sec,
							id: savedTime.idPonto,
						});
					}
				});

				if(timesLoaded !== []){
					console.log(timesLoaded);
					setSavedPontoTimer(timesLoaded);
				}
				
				if (savedTimes && savedTimes !== []) {
					await AsyncStorage.setItem('savedPontoTimer', JSON.stringify(savedTimes))
				} else await AsyncStorage.removeItem('savedPontoTimer');
			}

		} catch (e) {
			console.log(`loadSavedPontoTimer error ${e}`);
		}
	}

	useEffect(() => {
		loadSavedPontoTimer();
	}, []);

	return (
		<MapContext.Provider
			value={{
				getPontos,
				pontos,
				filterEndLoading,
				controle,
				isLoading,
				saveChangePontoTimer,
				savedPontoTimer,
			}}
		>
			{children}
		</MapContext.Provider>
	)
}