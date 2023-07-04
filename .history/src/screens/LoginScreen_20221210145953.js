import React, { useContext, useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { telefoneValidator } from '../helpers/telefoneValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { AuthContext } from '../context/AuthContext'
import Spinner from 'react-native-loading-spinner-overlay'

const LoginScreen = ({ navigation }) => {
  const [telefone, setTelefone] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const { isLoading, login } = useContext(AuthContext);
 
  const onLoginPressed = () => {
    const telefoneError = telefoneValidator(telefone.value)
    const passwordError = passwordValidator(password.value)
    if (telefoneError || passwordError) {
      setTelefone({ ...telefone, error: telefoneError })
      setPassword({ ...password, error: passwordError })
      return
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    })
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Spinner visible={isLoading(null)} />
      <Logo />
      <Header>Logar</Header>
      <TextInput
        label="Telefone"
        returnKeyType="next"
        value={telefone.value}
        onChangeText={(number) => setTelefone({ value: number, error: '' })}
        error={!!telefone.error}
        errorText={telefone.error}
        autoCapitalize="none"
        autoCompleteType="telefone"
        textContentType="contactAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Senha"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Esqueceu a sua senha?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={() => {
        login(telefone, password);
      }}>
        Entrar
      </Button>
      <View style={styles.row}>
        <Text>Ainda não têm uma conta? </Text>
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