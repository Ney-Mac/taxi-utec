import React, { useState, useEffect, useContext } from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Modal,
} from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../../core/theme";
import { MapContext } from "../../context/MapContext";
import CardInfo from "./CardInfo";
import { showMessage } from "react-native-flash-message";
import { getStatusBarHeight } from "react-native-status-bar-height";

const Card = ({ ponto, changeStatus, userLatitude, userLongitude }) => {
    const initialMin = 30, initialSec = 0;
    const [min, setMin] = useState(initialMin);
    const [sec, setSec] = useState(initialSec);
    const [controller, setController] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const { savedPontoTimer, saveChangePontoTimer } = useContext(MapContext);

    useEffect(() => {

        savedPontoTimer?.map(savedTimer => {
            if (ponto.id === savedTimer.id) {
                setMin(savedTimer.min);
                setSec(savedTimer.sec);
                setController(true);
            }
        })
        
    }, [savedPontoTimer]);

    const resetCounter = () => {
        setMin(initialMin);
        setSec(initialSec);
    }

    const onBtnPress = async (filaStatus) => {
        if(ponto.status === 0 && !filaStatus) {
            showMessage({
                message: "Estado do ponto",
                description: 'Informe o tamanho da fila',
                type: "warn",
                duration: 4000,
                autoHide: true,
                statusBarHeight: getStatusBarHeight(),
            });

            return;
        }
        if (!controller && ponto.enabled === 1) {
            let res = await changeStatus((ponto.status === 1) ? 0 : 1, ponto.id, filaStatus)
            if (res) {
                const date = new Date();

                const actualDate = {
                    idPonto: ponto.id,
                    hora: date.getHours(),
                    min: date.getMinutes(),
                    sec: date.getSeconds(),
                }

                saveChangePontoTimer(actualDate);

                resetCounter();
                setController(true);
            }
        }
    }

    const isActive = () => {
        if (ponto.ponto_actual !== 1) return false;
        if (ponto.enabled !== 1) return false;
        if (controller) return false;
        if (ponto.status !== 1) return false;

        return true;
    }

    const timeCounter = () => {
        if (controller) {
            if (sec > 0) {
                setTimeout(() => {//A cada 1s reduz 1s
                    setSec(sec - 1);
                }, 1000);
            } else if (min > 0) {
                setMin(min - 1);
                setSec(59);
            } else {
                setController(false);
            }
        }
    }

    useEffect(() => {
        timeCounter();
    }, [min, sec, controller]);

    return (
        <TouchableOpacity
            style={{
                shadowColor: isActive() ? theme.colors.primary : theme.colors.error,
                ...styles.container,
            }}
            onPress={() => { setShowInfo(true) }}
        >
            {showInfo &&
                <Modal transparent={true} visible={showInfo} >
                    <TouchableOpacity style={styles.infoContainer} activeOpacity={1} onPress={() => { setShowInfo(false) }}>
                        <CardInfo
                            ponto={ponto}
                            onBtnPress={onBtnPress}
                            min={min}
                            sec={sec}
                            controller={controller}
                            userLongitude={userLongitude}
                            userLatitude={userLatitude}
                        />
                    </TouchableOpacity>
                </Modal>
            }

            <View style={styles.header}>
                <Image
                    style={styles.img}
                    source={(ponto.type === 'atm') ?
                        require('../../assets/markers_img/pin.png')
                        :
                        require('../../assets/markers_img/gas-station-point.png')
                    }
                />
            </View>

            <View style={styles.body}>

                <Text style={styles.title} >{(ponto.type).toUpperCase()}</Text>

                {controller &&
                    <Text
                        style={{
                            borderColor: (isActive() ?
                                theme.colors.primary
                                :
                                theme.colors.error),
                            ...styles.text
                        }}
                    >
                        Aguarde:
                        <Text style={styles.textImportant}>
                            {' ' + min}:{(sec < 10) ? '0' : ''}{sec}s
                        </Text>
                    </Text>
                }

                <Text style={{ borderColor: isActive() ? theme.colors.primary : theme.colors.error, ...styles.text }}>
                    Estado:
                    <Text style={styles.textImportant}>
                        {(ponto.status === 1) ? ' Ativo' : ' Inativo'}
                    </Text>
                </Text>
                <Text style={{ borderColor: isActive() ? theme.colors.primary : theme.colors.error, ...styles.text }}>
                    Local:
                    <Text style={styles.textImportant}>
                        {' ' + ponto.location}
                    </Text>
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        elevation: 20,
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 30,
        marginHorizontal: 7,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: theme.colors.secondary,
        height: '45%',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        borderRadius: 20,
    },
    body: {
        flex: 1,
        width: '100%',
        paddingBottom: 5,
        paddingHorizontal: 15,
        justifyContent: 'space-around',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    title: {
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    img: {
        height: '85%',
        width: '65%',
    },
    text: {
        textAlign: 'center',
        borderBottomWidth: 2,
        fontSize: 12,
    },
    textImportant: {
        fontWeight: 'bold',
        fontSize: 13,
    }
});

export default Card;
