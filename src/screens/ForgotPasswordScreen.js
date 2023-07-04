import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { emailValidator } from '../helpers/emailValidator'
import { showMessage } from 'react-native-flash-message'
import { BASE_URL } from '../config'
import { theme } from '../core/theme'
import { Text } from 'react-native-paper'
import {
	Background,
	BackButton,
	Logo,
	Header,
	TextInput,
	Button,
} from '../components/index'
import Spinner from 'react-native-loading-spinner-overlay/lib'
import axios from 'axios'

export default function ForgotPasswordScreen({ navigation }) {
	const [email, setEmail] = useState({ value: '', error: '' })
	const [pin, setPin] = useState({ value: '', error: '' });
	const [isLoading, setIsLoading] = useState(false);
	const [showPinBox, setShowPinBox] = useState(false);

	const sendResetPasswordEmail = async () => {
		const emailError = emailValidator(email.value)
		if (emailError) {
			setEmail({ ...email, error: emailError })
			return;
		}

		setIsLoading(true);
		try {
			const res = await axios({
				url: `${BASE_URL}user/forgot-password`,
				method: 'post',
				params: {
					email: email.value,
				},
			});

			showMessage({
				message: 'Recuperar senha',
				description: res.data.message,
				autoHide: true,
				type: 'success',
				duration: 4000,
				statusBarHeight: getStatusBarHeight(),
			});

			setIsLoading(false);
			setShowPinBox(true);
		} catch (e) {
			console.log(`erro sendResetPasswordEmail ${e} -> ${e.response?.data.message}`)

			showMessage({
				message: 'Falha ao enviar email',
				description: e.response ? e.response.data.message : 'Está sem conexão a internet',
				autoHide: true,
				type: 'danger',
				statusBarHeight: getStatusBarHeight(),
			});

			setIsLoading(false);
		}
	}

	const onSendConfirmPin = async () => {
		const pinError = validatePin(pin.value);

		if (pinError) {
			setPin({ ...pin, error: pinError });
			return;
		}

		console.log(email.value, pin.value)

		setIsLoading(true);
		try {
			const res = await axios({
				method: 'post',
				url: `${BASE_URL}user/confirm-pin`,
				params: {
					login: email.value,
					verification_code: pin.value,
				}
			});

			showMessage({
				message: 'Recuperar senha',
				description: res.data.message,
				autoHide: true,
				type: 'success',
				duration: 4000,
				statusBarHeight: getStatusBarHeight(),
			});

			setIsLoading(false);
			navigation.navigate('SetNewPasswordScreen', { email: email.value });
		} catch (e) {
			console.log(`erro sendResetPasswordEmail ${e} -> ${e.response?.data.message}`)

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

	const validatePin = (value) => {
		if (!value) return 'Este campo não pode estar vazio.';
		if ((!/^\d+$/.test(value))) return 'Deve conter apénas números.';
		if (value.length > 6 || value.length < 6) return 'O código deve conter apénas 6 digitos.'
	}

	return (
		<Background>
			<BackButton goBack={navigation.goBack} />
			<Spinner visible={isLoading} />
			<Logo />
			<Header>Recuperar senha</Header>

			{(showPinBox === false) ?
				<>
					<TextInput
						label="Digite o seu email"
						returnKeyType="done"
						value={email.value}
						onChangeText={(text) => setEmail({ value: text, error: '' })}
						error={!!email.error}
						errorText={email.error}
						autoCapitalize="none"
						autoCompleteType="email"
						textContentType="emailAddress"
						keyboardType="email-address"
						description="Você receberá um e-mail com o link de redefinição de senha."
					/>

					<Button
						mode="contained"
						onPress={sendResetPasswordEmail}
						style={{ marginTop: 16 }}
					>
						Enviar instruções
					</Button>
				</>
				:
				<>
					<TextInput
						label="Digite o código"
						returnKeyType="done"
						value={pin.value}
						onChangeText={(text) => setPin({ value: text, error: '' })}
						error={!!pin.error}
						errorText={pin.error}
						autoCapitalize="none"
						keyboardType="numeric"
						description="Verifique seu email para obter o código de confirmação."
					/>

					<Button
						mode="contained"
						onPress={onSendConfirmPin}
						style={{ marginTop: 16 }}
					>
						Enviar Código
					</Button>

					<View style={styles.row}>
						<Text>Não é este o seu email? </Text>
						<TouchableOpacity onPress={() => { setShowPinBox(false) }}>
							<Text style={styles.link}>Alterar email</Text>
						</TouchableOpacity>
					</View>
				</>
			}

		</Background>
	)
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		marginTop: 16,
	},
	link: {
		fontWeight: 'bold',
		color: theme.colors.primary,
	},
});
