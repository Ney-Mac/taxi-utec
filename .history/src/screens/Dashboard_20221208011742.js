import React, { useContext } from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import Spinner from 'react-native-loading-spinner-overlay'
import  AuthContext  from '../context/AuthContext'

const Dashboard = () => {
  const {userInfo, logout, isLoading} = useContext(AuthContext);

  return (
    <Background>
      <Logo />
      <Spinner visible={isLoading} />
      <Header>Localiza</Header>
      <Paragraph>
        Seja bem-vindo. {userInfo.user.email}
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


export default Dashboard;