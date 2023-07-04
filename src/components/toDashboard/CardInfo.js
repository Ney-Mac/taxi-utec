import { useState, useContext, useEffect } from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { View, StyleSheet } from 'react-native'
import { SegmentedButtons } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { showMessage } from 'react-native-flash-message';
import { BASE_URL } from '../../config';
import { theme } from '../../core/theme';
import { Text } from 'react-native-paper';
import Background from '../global/Background';
import Header from '../global/Header';
import Button from '../global/Button';
import axios from 'axios';

export default function CardInfo({ ponto, userLatitude, userLongitude, onBtnPress, min, sec, controller }) {
    const filaStatus = {
        vazio: 'menos de 10',
        medio: 'entre 10 e 20',
        cheio: 'mais de 10'
    }

    const { userInfo } = useContext(AuthContext);
    const [segButtonValue, setSegButtonValue] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (segButtonValue) {
            changeFilaStatus();
        }
    }, [segButtonValue]);

    const changeFilaStatus = async () => {
        setIsLoading(true);
        try {
            const res = await axios({
                method: 'put',
                url: `${BASE_URL}alterar-estado-ponto/${ponto.id}`,
                headers: {
                    Authorization: `Bearer ${userInfo.accessToken}`
                },
                params: {
                    estado: ponto.status,
                    latitude: userLatitude,
                    longitude: userLongitude,
                    //latitude: ponto.latitude,
                    //longitude: ponto.longitude,
                    fila: segButtonValue,
                }
            });
            console.log(res.data);

            showMessage({
                message: "Estado do ponto",
                description: res.data.message,
                type: "success",
                duration: 4000,
                autoHide: true,
                statusBarHeight: getStatusBarHeight(),
            });

            setIsLoading(false);
        } catch (e) {
            console.log(`chageFilaStatus error ${e} -> ${e.response?.data.message}`);

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

    return (
        <View style={styles.info}>
            <Background>
                <Header>{ponto.type.toUpperCase()}</Header>

                {controller && <Text style={{ color: theme.colors.error }}>
                    Aguarde: {' ' + min}:{(sec < 10) ? '0' : ''}{sec}s
                </Text>}

                <View style={{ height: '70%', width: '100%', }} >

                    <View style={styles.row} >
                        <View style={styles.columnLeft} >
                            <Text>Localidade</Text>
                        </View>

                        <View style={styles.columnRight} >
                            <Text style={styles.textLeft} >{ponto.location}</Text>
                        </View>
                    </View>

                    <View style={styles.row} >
                        <View style={styles.columnLeft} >
                            <Text>Estado</Text>
                        </View>

                        <View style={styles.columnRight} >
                            <Text style={styles.textLeft}>{(ponto.status === 1) ? ' Ativo' : ' Inativo'}</Text>
                        </View>
                    </View>

                    <View style={styles.row} >
                        <View style={styles.columnLeft} >
                            <Text>Id</Text>
                        </View>

                        <View style={styles.columnRight} >
                            <Text style={styles.textLeft}>{ponto.id}</Text>
                        </View>
                    </View>

                    <View style={styles.row} >
                        <View style={styles.columnLeft} >
                            <Text>Latitude</Text>
                        </View>

                        <View style={styles.columnRight} >
                            <Text style={styles.textLeft}>{ponto.latitude}</Text>
                        </View>
                    </View>

                    <View style={styles.row} >
                        <View style={styles.columnLeft} >
                            <Text>Longitude</Text>
                        </View>

                        <View style={styles.columnRight} >
                            <Text style={styles.textLeft}>{ponto.longitude}</Text>
                        </View>
                    </View>

                    <Text style={{ width: '100%', textAlign: 'center', padding: 4 }}>Informe o tamanho da fila</Text>

                    <SegmentedButtons
                        value={segButtonValue}
                        onValueChange={setSegButtonValue}
                        style={{ width: '100%' }}
                        buttons={[
                            {
                                value: filaStatus.vazio,
                                label: '-10',
                                showSelectedCheck: true,
                                style: {
                                    backgroundColor: segButtonValue === filaStatus.vazio ? theme.colors.primary : theme.colors.surface,
                                    width: '30%',
                                    borderColor: theme.colors.primary,
                                },
                            },
                            {
                                value: filaStatus.medio,
                                label: '10-20',
                                showSelectedCheck: true,
                                style: {
                                    backgroundColor: segButtonValue === filaStatus.medio ? theme.colors.warn : theme.colors.surface,
                                    width: '40%',
                                    borderColor: theme.colors.warn,
                                },
                            },
                            {
                                value: filaStatus.cheio,
                                label: '+20',
                                showSelectedCheck: true,
                                style: {
                                    backgroundColor: segButtonValue === filaStatus.cheio ? theme.colors.error : theme.colors.surface,
                                    width: '30%',
                                    borderColor: theme.colors.error,
                                },
                            },
                        ]}
                    />

                </View>

                <Button mode="elevated" onPress={() => { onBtnPress(segButtonValue) }}>
                    {(ponto.status === 1) ? ' Desactivar' : ' Activar'}
                </Button>
            </Background>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        width: '100%',
        height: '13%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.primary,
        marginVertical: 4,
    },
    textLeft: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    columnLeft: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '40%',
        paddingLeft: 4,
    },
    columnRight: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '60%',
        paddingLeft: 4,
    },
    info: {
        height: '70%',
        width: '80%',
        borderRadius: 40,
        overflow: 'hidden',
        elevation: 20,
        shadowOffset: {
            width: 20,
            height: 20,
        },
        shadowOpacity: 1,
        shadowRadius: 30,
        marginHorizontal: 7,
    },
});