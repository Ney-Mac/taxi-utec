import React from 'react'
import {
	Background,
	Logo,
	Button,
	Paragraph,
} from '../components/index';
import { AuthProvider } from '../context/AuthContext'

const StartScreen = ({ navigation }) => {
	return (
		<AuthProvider>
			<Background>
				<Logo style={{ width: 220, height: 220 }} />
				<Button
					mode="contained"
					onPress={() => navigation.navigate('LoginScreen')}
				>
					Entrar
				</Button>
				<Button
					mode="outlined"
					onPress={() => navigation.navigate('RegisterScreen')}
				>
					Criar conta
				</Button>
			</Background>
		</AuthProvider>
	)
}

export default StartScreen;