import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';

export default function Dashboard({ navigation }) {

  const {userInfo, isLoading, logout} = useContext(AuthContext);

  return (
    <Background>
      <Logo />
      <Spinner visible={isLoading} />
      <Header>Localiza</Header>
      <Paragraph>
        Seja bem-vindo. {userInfo.user.name}
      </Paragraph>
      <Button
        mode="outlined"
        onPress={logout}
      >
        Sair
      </Button>
    </Background>
  )
}
