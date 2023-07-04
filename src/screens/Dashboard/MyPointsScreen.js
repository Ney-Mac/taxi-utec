import React, { useState, useContext, useEffect } from 'react'
import {
    BackButton,
    Background,
    Card,
    Paragraph,
    Header,
} from '../../components/index'
import { View, StyleSheet, FlatList } from 'react-native'
import axios from 'axios'
import { showMessage } from 'react-native-flash-message'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { BASE_URL } from '../../config'
import { AuthContext } from '../../context/AuthContext'
import Spinner from 'react-native-loading-spinner-overlay/lib'
import * as Location from 'expo-location'

const MyPointsScreen = ({ navigation }) => {
    const { userInfo } = useContext(AuthContext);
    const [myPoints, setMyPoints] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [refresh, setRefresh] = useState(false);
    
    useEffect(() => {
        getMyPoints();
        getInformerLocation();
    }, []);

    useEffect(() => {
        if (refresh === true) {
            getMyPoints();
            setRefresh(false);
        }
    }, [refresh]);

    const getMyPoints = async () => {//Buscar pontos ligados ao informer
        setIsLoading(true);
        try {
            const res = await axios({
                method: 'get',
                url: `${BASE_URL}get-meus-pontos`,
                headers: {
                    Authorization: `Bearer ${userInfo.accessToken}`
                },
            });

            console.log(res.data.data);

            setMyPoints(res.data.data);

            setIsLoading(false);
        } catch (e) {
            console.log(`getMyPoints error ${e} -> ${e.response?.data?.message}`);

            showMessage({
                message: "Falha na busca",
                description: e.response ? e.response.data.message : 'Está sem conexão a internet',
                type: "danger",
                duration: 4000,
                autoHide: true,
                statusBarHeight: getStatusBarHeight(),
            });

            setIsLoading(false);
        }
    }


    const changeStatus = async (estado, id, filaStatus) => {
        setIsLoading(true);
        
        if(!longitude && !latitude) return;

        try {

            const res = await axios({
                method: 'put',
                url: `${BASE_URL}alterar-estado-ponto/${id}`,
                headers: {
                    Authorization: `Bearer ${userInfo.accessToken}`
                },
                params: {
                    estado,
                    latitude,
                    longitude,
                    fila: filaStatus,
                }
            });

            showMessage({
                message: "Estado do ponto",
                description: res.data.message,
                type: "info",
                duration: 4000,
                autoHide: true,
                statusBarHeight: getStatusBarHeight(),
            });

            setRefresh(true);
            setIsLoading(false);
            return true;
        } catch (e) {
            console.log(`changeStatus error ${e}`);

            showMessage({
                message: "Falha na alteração",
                description: e.response ? e.response.data.message : 'Está sem conexão a internet',
                type: "danger",
                duration: 4000,
                autoHide: true,
                statusBarHeight: getStatusBarHeight(),
            });

            setIsLoading(false);
        }
    }

    const getInformerLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            console.log(`erro getLocation ${status}`);

            showMessage({
                message: "Permissão negada",
                description: "Localiza precisa de sua localização para funcionar",
                type: "info",
                duration: 4000,
                autoHide: true,
            })
            return;
        }

        let location = await Location.getCurrentPositionAsync({});

        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
    }

    const renderCard = ({ item }) => (
        <View style={styles.card}>
            <Card ponto={item} userLatitude={latitude} userLongitude={longitude} changeStatus={changeStatus} />
        </View>
    )

    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
            <Spinner visible={isLoading} />

            <Header>Meus Pontos</Header>
            <Paragraph style={{ fontSize: 12 }}>Clique sobre o ponto para alterar o estado</Paragraph>
            <View style={styles.list} >
                <FlatList
                    style={styles.flatList}
                    data={myPoints}
                    renderItem={renderCard}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                />
            </View>
        </Background>
    )
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    flatList: {
        height: '100%',
        width: '100%',
    },
    card: {
        height: 260,
        width: 200,
        padding: 15,
    }
});

export default MyPointsScreen;