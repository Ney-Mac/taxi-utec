import React, { useState, useEffect, useContext } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import {
    Background,
    BackButton,
    Logo,
    Header,
    TextInput,
    Button,
    Paragraph,
} from '../components/index';
import { theme } from "../core/theme";
import { useRoute } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay/lib";
import axios from "axios";
import { BASE_URL } from "../config";
import { showMessage } from "react-native-flash-message";
import { AuthContext } from "../context/AuthContext";
import { getStatusBarHeight } from "react-native-status-bar-height";

export default function CodValidateScreen({ navigation }) {
    const route = useRoute();
    const { telefone, name, email, endereco } = route.params;
    const [cod, setCod] = useState({ value: '', error: '' });

    //Variaveis para controlar o tempo
    const [controller, setController] = useState(true);
    const [min, setMin] = useState(0); //Minutos
    const [sec, setSec] = useState(10); //Segundos

    //Auxiliares
    const { finalRegister, isLog, userInfo, resetUserData } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const validateCode = () => {
        if (!cod.value) setCod({ ...cod, error: 'Código de validação não pode estar vazio' });
        else {
            isLog ? validateChangeCode() : finalRegister(String(cod.value), telefone);
        }
    }

    const validateChangeCode = async () => {
        setIsLoading(true);
        try {
            const res = await axios({
                url: `${BASE_URL}user/alterar-phone`,
                method: 'put',
                headers: {
                    Authorization: `Bearer ${userInfo.acessToken}`
                },
                data: {
                    newTelefone: telefone,
                    verification_code: String(cod.value),
                }
            });
            console.log(res.data);

            userInfo.user.telefone = telefone;

            resetUserData(name, email, endereco);
            navigation.jumpTo('Perfíl');

            setIsLoading(false);
        } catch (e) {
            console.log(`validateChangeCode error ${e}`);

            showMessage({
                message: 'Falha na validação',
                description: e.response ? e.response.data.message : 'Está sem conexão a internet',
                type: 'danger',
                duration: 4000,
                statusBarHeight: getStatusBarHeight(),
            });

            if (e.response.status) {
                navigation.navigate('DashboardRoute', { 
                    screen: 'ResetUserData', 
                    params: { validateCodeError: true } 
                });
            }

            setIsLoading(false);
        }
    }

    const resendCode = () => {
        setMin(0);
        setSec(10);
        setController(true);
        setIsLoading(true);

        axios({
            url: `${BASE_URL}user/send-code`,
            method: 'post',
            data: {
                telefone: isLog ? userInfo.user.telefone : telefone,
                natureza: 'registo',
            }
        })
            .then(() => {
                showMessage({
                    message: 'Código de validação',
                    description: 'Verifique sua caixa de mensagens',
                    type: 'info',
                    duration: 4000,
                    statusBarHeight: getStatusBarHeight(),
                })
                setIsLoading(false);
            })
            .catch(e => {
                console.log(`ResendCode error ${e}`);

                showMessage({
                    message: 'Erro ao reenviar código',
                    description: e.response ? e.response.data.message : 'Está sem conexão a internet',
                    type: 'danger',
                    duration: 4000,
                    statusBarHeight: getStatusBarHeight(),
                })
                setIsLoading(false);
            });
    }

    useEffect(() => { // Faz o controle do tempo para reenviar o codigo
        if (sec > 0) {
            setTimeout(() => {
                setSec(sec - 1)
            }, 1000);
        } else if (min > 0) {
            setMin(min - 1);
            setSec(60);
        } else {
            setController(false);
        }
    }, [min, sec]);

    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
            <Spinner visible={isLoading} />
            <Logo />
            <Header>Código de validação</Header>
            {controller && <Paragraph>Se não recebeu o código em reenviar código após {min}:{sec} minutos </Paragraph>}
            <TextInput
                label="Insira o código de validação"
                returnKeyType="done"
                value={cod.value}
                onChangeText={text => setCod({ value: text, error: '' })}
                error={!!cod.error}
                errorText={cod.error}
                autoCapitalize="none"
                description="Irá receber um código de verificação no seu número de telefone."
                keyboardType="numeric"
            />

            {(!controller) && <TouchableOpacity onPress={resendCode}>
                <Paragraph style={styles.resend} >Reenviar código</Paragraph>
            </TouchableOpacity>}

            <Button
                mode="contained"
                onPress={validateCode}
                style={{ marginTop: 16 }}
            >
                Validar código
            </Button>
        </Background>
    )
}

const styles = StyleSheet.create({
    resend: {
        color: theme.colors.error,
        paddingTop: 24,
        fontSize: 16,
    }
})