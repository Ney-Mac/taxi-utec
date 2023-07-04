import React, { useState, useContext } from 'react'
import {
    Background,
    BackButton,
    Logo,
    Header,
    TextInput,
    Button,
} from '../components/index'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { passwordValidator } from '../helpers/passwordValidator'
import { confirmPassword } from '../helpers/confirmPassword'
import { AuthContext } from '../context/AuthContext'
import { showMessage } from 'react-native-flash-message'
import { useRoute } from '@react-navigation/native'
import { BASE_URL } from '../config'
import axios from 'axios'
import Spinner from 'react-native-loading-spinner-overlay/lib'

export default function SetNewPasswordScreen({ navigation }) {
    const [password, setPassword] = useState({ value: '', error: '' });
    const [confirmPass, setConfirmPass] = useState({ value: '', error: '' });
    const [isLoading, setIsLoading] = useState(false);

    const route = useRoute();
    const { email } = route.params ? route.params : { ...null };

    const sendNewPassword = async () => {
        const passwordError = passwordValidator(password.value);
        const confirmError = confirmPassword(password.value, confirmPass.value);

        console.log(email);

        if (passwordError || confirmError) {
            setPassword({ ...password, error: passwordError });
            setConfirmPass({ ...confirmPass, error: confirmError });
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios({
                method: 'post',
                url: `${BASE_URL}user/reset-password`,
                data: {
                    email: email,
                    password: password.value,
                    password_confirmation: confirmPass.value,
                }
            });

            showMessage({
                message: 'Recuperar Senha',
                description: res.data.message,
                autoHide: true,
                type: 'success',
                duration: 4000,
                statusBarHeight: getStatusBarHeight(),
            });

            setIsLoading(false);
            navigation.navigate('LoginScreen');

        } catch (e) {
            console.log(`erro sendNewPassword ${e} -> ${e.response?.data.message}`)

            showMessage({
                message: 'Falha ao enviar código',
                description: e.response ? e.response.data.message : 'Está sem conexão a internet',
                autoHide: true,
                type: 'danger',
                statusBarHeight: getStatusBarHeight(),
            });

            setIsLoading(false);
        }
    }

    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
            <Spinner visible={isLoading} />
            <Logo />
            <Header>Nova Senha</Header>

            <TextInput
                label="Nova senha"
                returnKeyType="next"
                value={password.value}
                onChangeText={(text) => setPassword({ value: text, error: '' })}
                error={!!password.error}
                errorText={password.error}
                isPassword={true}
            />

            <TextInput
                label="Confirmar senha"
                returnKeyType="done"
                value={confirmPass.value}
                onChangeText={(text) => setConfirmPass({ value: text, error: '' })}
                error={!!confirmPass.error}
                errorText={confirmPass.error}
                isPassword={true}
            />

            <Button
                mode="contained"
                onPress={sendNewPassword}
                style={{ marginTop: 16 }}
            >
                Enviar senha
            </Button>
        </Background>
    )
}
