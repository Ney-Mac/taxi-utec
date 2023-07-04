import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import { AuthProvider } from '../context/AuthContext'

const StartScreen = ({ navigation }) => {
  return (
    <AuthProvider>
    <Background>
      <Logo />
      <Header>Localiza App</Header>
      <Paragraph>
        Seu aplicativo para localizar ATM e Bombas de combustível.
      </Paragraph>
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