import React, { useContext, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Keyboard } from 'react-native';
import { Text } from 'react-native-paper';
import {
	Background,
	Logo,
	Header,
	Button,
	TextInput,
	BackButton,
} from '../components/index';
import { theme } from '../core/theme';
import { emailOrPhoneValidator } from '../helpers/emailOrPhoneValidator';
import { passwordValidator } from '../helpers/passwordValidator';
import { AuthContext } from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay'

const LoginScreen = ({ navigation }) => {
	const [emailOrPhone, setEmailOrPhone] = useState({ value: '', error: '' });
	const [password, setPassword] = useState({ value: '', error: '' });
	const { isLoading, login } = useContext(AuthContext);

	const onLoginPressed = () => {
		const emailOrPhoneError = emailOrPhoneValidator(emailOrPhone.value);
		const passwordError = passwordValidator(password.value)
		if (emailOrPhoneError || passwordError) {
			setEmailOrPhone({ ...emailOrPhone, error: emailOrPhoneError })
			setPassword({ ...password, error: passwordError })
			return
		}
	}

	return (
		<Background  onPress={Keyboard.dismiss}>
			<BackButton goBack={navigation.goBack} />
			<Spinner visible={isLoading} />
			<Logo />
			<Header>Login</Header>
			<TextInput
				label="Email ou telemóvel"
				returnKeyType="next"
				value={emailOrPhone.value}
				onChangeText={(text) => setEmailOrPhone({ value: text, error: '' }) }
				error={!!emailOrPhone.error}
				errorText={emailOrPhone.error}
				autoCapitalize="none"
				textContentType="contactAddress"
				keyboardType="email-address"
			/>
			<TextInput
				label="Senha"
				returnKeyType="done"
				value={password.value}
				onChangeText={(text) => setPassword({ value: text, error: '' }) }
				error={!!password.error}
				errorText={password.error}
				isPassword={true}
			/>
			<View style={styles.forgotPassword}>
				<TouchableOpacity
					onPress={() => navigation.navigate('ForgotPasswordScreen')}
				>
					<Text style={styles.forgot}>Esqueceu a sua senha?</Text>
				</TouchableOpacity>
			</View>
			<Button mode="contained" onPress={onLoginPressed}>
				Entrar
			</Button>
			<View style={styles.row}>
				<Text>Ainda não tem uma conta? </Text>
				<TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
					<Text style={styles.link}>Criar conta</Text>
				</TouchableOpacity>
			</View>
		</Background>
	)
}

const styles = StyleSheet.create({
	forgotPassword: {
		width: '100%',
		alignItems: 'flex-end',
		marginBottom: 24,
	},
	row: {
		flexDirection: 'row',
		marginTop: 4,
	},
	forgot: {
		fontSize: 13,
		color: theme.colors.secondary,
	},
	link: {
		fontWeight: 'bold',
		color: theme.colors.primary,
	},
})


export default LoginScreen;