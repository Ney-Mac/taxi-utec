import React, { useState, useContext } from 'react'
import {
	Background,
	BackButton,
	Logo,
	Header,
	TextInput,
	Button,
} from '../../components/index'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { passwordValidator } from '../../helpers/passwordValidator'
import { confirmPassword } from '../../helpers/confirmPassword'
import { AuthContext } from '../../context/AuthContext'
import { showMessage } from 'react-native-flash-message'
import { BASE_URL } from '../../config'
import axios from 'axios'
import Spinner from 'react-native-loading-spinner-overlay/lib'

export default function ChangeUserPassword({ navigation }) {
	const [password, setPassword] = useState({ value: '', error: '' });
	const [confirm, setConfirm] = useState({ value: '', error: '' });
	const [actualPass, setActualPass] = useState({ value: '', error: '' });
	const [isLoading, setIsLoading] = useState(false);
	const { userInfo } = useContext(AuthContext);

	const onSendPressed = () => {
		const actualPassError = passwordValidator(actualPass.value);
		const passwordError = passwordValidator(password.value);
		const confirmError = confirmPassword(confirm.value, password.value);
		if (actualPassError || passwordError || confirmError) {
			setActualPass({ ...actualPass, error: actualPassError })
			setPassword({ ...password, error: passwordError })
			setConfirm({ ...confirm, error: confirmError })
			return
		}
		
		changePass();
	}

	const changePass = async () => {
		setIsLoading(true);

		try{
			const res = await axios({
				method: 'post',
				url: `${BASE_URL}user/alterar-my-password`,
				headers: {
					Authorization: `Bearer ${userInfo.accessToken} `
				},
				data: {
					older_password: actualPass.value,
					new_password: password.value,
					password_confirmation: confirm.value,
				}
			});

			showMessage({
				message: 'Alterar senha',
                description: res.data.message,
                type: 'success',
                duration: 4000,
                statusBarHeight: getStatusBarHeight(),
			});

			setActualPass({ value: '', error: '' });
			setPassword({ value: '', error: '' });
			setConfirm({ value: '', error: '' });
			
			navigation.jumpTo('Início');

			setIsLoading(false);
		}catch(e){
			console.log(`changePass error ${e}`);

			showMessage({
				message: 'Alterar senha',
                description: e.response ? e.response.data.message : 'Está sem conexão a internet',
                type: 'danger',
                duration: 4000,
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
			<Header>Alterar Senha</Header>

			<TextInput
				label="Senha atual"
				returnKeyType="next"
				value={actualPass.value}
				onChangeText={(text) => setActualPass({ value: text, error: '' })}
				error={!!actualPass.error}
				errorText={actualPass.error}
				isPassword={true}
			/>
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
				value={confirm.value}
				onChangeText={(text) => setConfirm({ value: text, error: '' })}
				error={!!confirm.error}
				errorText={confirm.error}
				isPassword={true}
			/>
			
			<Button
				mode="contained"
				onPress={onSendPressed}
				style={{ marginTop: 16 }}
			>
				Alterar senha
			</Button>
		</Background>
	)
}
