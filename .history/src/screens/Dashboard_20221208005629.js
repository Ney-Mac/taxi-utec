import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import Spinner from 'react-native-loading-spinner-overlay'

export default function Dashboard({ navigation }) {
  return (
    <Background>
      <Logo />
      <Spinner visible={isLoading} />
      <Header>Localiza</Header>
      <Paragraph>
        Seja bem-vindo.
      </Paragraph>
      <Button
        mode="outlined"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
        }
      >
        Sair
      </Button>
    </Background>
  )
}
