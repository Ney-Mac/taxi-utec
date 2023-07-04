import React, { useState, useContext } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { codigoValidator } from '../helpers/codigoValidator'
import { telefoneValidator } from '../helpers/telefoneValidator'
import  AuthContext  from '../context/AuthContext'
import Spinner from '../context/AuthContext'

export default function RegisterScreen({ navigation }) {
  const [codigo, setCodigo] = useState({ value: '', error: '' })
  const [telefone, setTelefone] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const {register, isLoading} = useContext(AuthContext);
  
  const onSignUpPressed = () => {
    const codigoError = codigoValidator(codigo.value)
    const telefoneError = telefoneValidator(telefone.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
  
    if ( telefoneError ||emailError || passwordError || codigoError) {
      setCodigo({ ...codigo, error: codigoError })
      setTelefone({ ...telefone, error: telefoneError })
      setEmail({ ...email, error: emailError })
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
      <Logo />
      <Header>Criar conta</Header>
      <Spinner visible={isLoading} />
      <TextInput
        label="Telefone"
        returnKeyType="next"
        value={telefone.value}
        onChangeText={(number) => setTelefone({ value: number, error: '' })}
        error={!!telefone.error}
        errorText={telefone.error}
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
        label="Codigo"
        returnKeyType="next"
        value={codigo.value}
        onChangeText={(text) => setCodigo({ value: text, error: '' })}
        error={!!codigo.error}
        errorText={codigo.error}
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
      <Button
        mode="contained"
        onPress={() => {
          register(telefone, email, codigo, password), onSignUpPressed;
        }}
        style={{ marginTop: 24 }}
      >
        Versão Grátis
      </Button>
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Pagamento
      </Button>
      <View style={styles.row}>
        <Text>Já têm uma conta criada? </Text>
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
})
