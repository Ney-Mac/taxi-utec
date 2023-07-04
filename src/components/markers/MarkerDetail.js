import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button, ProgressBar, MD3Colors } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import Header from "../global/Header";
import { theme } from "../../core/theme";
import axios from "axios";
import { showMessage } from "react-native-flash-message";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { BASE_URL } from "../../config";
import { AuthContext } from "../../context/AuthContext";

export default function MarkerDetail({ type, location, updated, ultimoHistorico, fila }) {
    const [like, setLike] = useState(null);
    const [unlike, setUnlike] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(null);
    const [progressColor, setProgressColor] = useState(null);
    const { userInfo } = useContext(AuthContext);

    const filaStatus = {
        vazio: 'menos de 10',
        medio: 'entre 10 e 20',
        cheio: 'mais de 10'
    }

    useEffect(() => {
        if (typeof (fila) === 'string') {
            if (fila === filaStatus.vazio) {
                setProgress(0);
                setProgressColor(theme.colors.primary);
            } else if (fila === filaStatus.medio) {
                setProgress(0.5);
                setProgressColor(theme.colors.warn);
            } else if (fila === filaStatus.cheio) {
                setProgress(1);
                setProgressColor(theme.colors.error);
            }
        }
    }, [fila]);

    const sendReaction = async (reaction) => {
        setIsLoading(true);

        if (!ultimoHistorico || ultimoHistorico === []) {
            setIsLoading(false);

            showMessage({
                message: `Avaliação`,
                description: 'Sem informações no momento, tente mais tarde!',
                autoHide: true,
                type: 'warning',
                statusBarHeight: getStatusBarHeight(),
            });

            return
        };

        try {
            const res = await axios({
                url: `${BASE_URL}avaliar-estado-ponto`,
                method: 'post',
                headers: {
                    Authorization: `Bearer ${userInfo.accessToken}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    id_ponto_history: ultimoHistorico.id,
                    nota: reaction,
                }
            });

            console.log(res.data);

            showMessage({
                message: `Avaliação`,
                description: res.data.message,
                autoHide: true,
                type: 'success',
                statusBarHeight: getStatusBarHeight(),
            });

            if (reaction === 1) {
                setLike(true);
                setUnlike(false);
            } else {
                setUnlike(true);
                setLike(false);
            }

            setIsLoading(false);
        } catch (e) {
            console.log(`onLikePressed error ${e} -> ${e.response?.data.message}`);

            showMessage({
                message: `Ocorreu alguma falha`,
                description: e.response ? 'Não pode partilhar sua reação agora' : 'Está sem conexão a internet',
                autoHide: true,
                type: 'danger',
                statusBarHeight: getStatusBarHeight(),
            });

            setIsLoading(false);
        }
    }

    const setUnlikeIconColor = () => {
        if (unlike) return theme.colors.primary;
    }

    const setLikeIconColor = () => {
        if (like) return theme.colors.primary;
    }

    return (
        <View style={styles.container}>
            <Spinner visible={isLoading} />
            <Header>{type?.toUpperCase()}</Header>

            <View style={{ width: '100%', paddingHorizontal: 10, }}>

                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.text}>Localidade:</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.textImportant}> {location} </Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.text}>Última atualização:</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.textImportant}> {updated?.split('T')[0]} </Text>
                        <Text style={styles.textImportant}> {updated?.split('T')[1].split('.')[0]} </Text>
                    </View>
                </View>

                {userInfo?.user?.roles[0].name !== 'informer' &&
                    ((typeof (fila) === 'string') && <View style={{ ...styles.row, flexDirection: 'column' }}>
                        <ProgressBar progress={progress} color={progressColor} height='auto' width='100%' />
                        <View style={{ width: '100%', height: 'auto', justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text
                                style={{
                                    color: (progress === 0)? theme.colors.primary : '',
                                    fontWeight: (progress === 0) ? 'bold' : 'normal'
                                }}
                            >
                                {filaStatus.vazio}
                            </Text>

                            <Text
                                style={{
                                    color: (progress === 0.5)? theme.colors.warn : '',
                                    fontWeight: (progress === 0.5) ? 'bold' : 'normal'
                                }}
                            >
                                {filaStatus.medio}
                            </Text>

                            <Text
                                style={{
                                    color: (progress === 1)? theme.colors.error : '',
                                    fontWeight: (progress === 1) ? 'bold' : 'normal'
                                }}
                            >
                                {filaStatus.cheio}
                            </Text>

                        </View>
                    </View>)
                }



            </View>

            {userInfo?.user?.roles[0].name !== 'informer' && <View style={styles.rowButton}>

                <View style={{ width: '50%' }}>
                    <Button
                        onPress={() => { sendReaction(1) }}
                        icon={() => (
                            <Icon
                                name='thumb-up'
                                size={30}
                                color={setLikeIconColor()}
                            />
                        )}
                    />
                </View>
                <View style={{ width: '50%' }}>
                    <Button
                        onPress={() => { sendReaction(0) }}
                        icon={() => (
                            <Icon
                                name='thumb-down'
                                size={30}
                                color={setUnlikeIconColor()}
                            />
                        )}
                    />
                </View>

            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        borderBottomColor: theme.colors.secondary,
        borderBottomWidth: 1,
    },
    col: {
        width: '50%',
    },
    text: {
        fontSize: 12,
        paddingTop: 10,
    },
    textImportant: {
        fontWeight: 'bold',
    },
    rowButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
    }
});