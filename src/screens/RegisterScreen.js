import React, { useContext, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Text } from 'react-native-paper'
import {
	Background,
	Logo,
	Header,
	Button,
	TextInput,
	BackButton,
} from '../components/index'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nomeValidator } from '../helpers/nomeValidator'
import { telefoneValidator } from '../helpers/telefoneValidator'
import { confirmPassword } from '../helpers/confirmPassword'
import { AuthContext } from '../context/AuthContext'
import Spinner from 'react-native-loading-spinner-overlay/lib'

const RegisterScreen = ({ navigation }) => {
	const { isLoading, preRegister, userInfo } = useContext(AuthContext);
	const [name, setName] = useState({ value: userInfo?.name || '', error: '' });
	const [email, setEmail] = useState({ value: userInfo?.email || '', error: '' });
	const [telefone, setTelefone] = useState({ value: userInfo?.telefone || '', error: '' });
	const [password, setPassword] = useState({ value: userInfo?.password || '', error: '' });
	const [confirm, setConfirm] = useState({ value: userInfo?.password || '', error: '' });

	const onSignUpPressed = () => {
		const nameError = nomeValidator(name.value);
		const telefoneError = telefoneValidator(telefone.value);
		const emailError = emailValidator(email.value);
		const passwordError = passwordValidator(password.value);
		const confirmError = confirmPassword(confirm.value, password.value);
		if (telefoneError || emailError || passwordError || confirmError) {
			setName({ ...name, error: nameError })
			setTelefone({ ...telefone, error: telefoneError }) 
			setEmail({ ...email, error: emailError })
			setPassword({ ...password, error: passwordError })
			setConfirm({ ...confirm, error: confirmError })
			return
		}
	}

	return (
		<Background>
			<BackButton goBack={navigation.goBack} />
			<Spinner visible={isLoading} />
			
			<Logo style={{ width: 110, height: 110, padding: 0, margin: 0 }} />
			
			<Header>Criar conta</Header>
			
			<TextInput
				label="Nome"
				returnKeyType="next"
				value={name.value}
				onChangeText={(text) => setName({ value: text, error: '' })}
				error={!!name.error}
				errorText={name.error}
			/>
			<TextInput
				label="Email"
				returnKeyType="next"
				value={email.value}
				onChangeText={(text) => setEmail({ value: text, error: '' })}
				error={!!email.error}
				errorText={email.error}
				autoCapitalize="none"
				autoCompleteType="email"
				textContentType="emailAddress"
				keyboardType="email-address"
			/>
			<TextInput
				label="Telefone"
				returnKeyType="next"
				value={telefone.value}
				onChangeText={(number) => setTelefone({ value: number, error: '' })}
				error={!!telefone.error}
				errorText={telefone.error}
				autoCapitalize="none"
				autoCompleteType="telefone"
				textContentType="contact"
				keyboardType="numeric"
			/>
			<TextInput
				label="Senha"
				returnKeyType="done"
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
				onPress={onSignUpPressed}
				style={{ marginTop: 24 }}
			>
				Criar Conta
			</Button>

			<View style={styles.row}>
				<Text>Já tem uma conta criada? </Text>
				<TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
					<Text style={styles.link}>Entrar</Text>
				</TouchableOpacity>
			</View>
		</Background>
	)
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		marginTop: 4,
	},
	link: {
		fontWeight: 'bold',
		color: theme.colors.primary,
	},
	scroll: {
		flex: 1,
		width: '100%',
		flexDirection: 'column',
		backgroundColor: 'pink',
	}
})


export default RegisterScreen;