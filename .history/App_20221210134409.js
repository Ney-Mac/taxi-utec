import React, { useContext } from 'react'
import 'react-native-gesture-handler';
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
} from './src/screens'
import { AuthContext, AuthProvider } from './src/context/AuthContext'

const Stack = createStackNavigator()

const App = () => {

  const userInfo = useContext(AuthContext);


  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <AuthProvider>
          {userInfo ? (
            <Stack.Group>
              
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            </Stack.Group>

          ) : (
            <>
            <Stack.Screen name="Dashboard" component={Dashboard} />
              <Stack.Screen
                name="ResetPasswordScreen"
                component={ResetPasswordScreen}
              />
            </>)}
          <Stack.Navigator
            initialRouteName="StartScreen"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="StartScreen" component={StartScreen} />
          </Stack.Navigator>
        </AuthProvider>
      </NavigationContainer>
    </Provider>
  )
}

export default App;