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
    ForgotPasswordScreen,
    CodValidateScreen,
    DashboardRoute,
    SetNewPasswordScreen,
} from './src/screens'
import { AuthContext } from './src/context/AuthContext'
import FlashMessage from 'react-native-flash-message';

const Stack = createStackNavigator() //cria uma pilha de navegação de modo a permitir navegar entre as diferentes páginas do app

const Routes = () => {

    const { isLog } = useContext(AuthContext);

    return (
        <Provider theme={theme}>

            <NavigationContainer>
                <Stack.Navigator initialRouteName="MyPointsScreen" screenOptions={{ headerShown: false }}>

                    {!isLog ? (
                        <>
                            <Stack.Screen name="DashboardRoute" component={DashboardRoute} />
                        </>
                    ) : (
                        <>
                            <Stack.Screen name="StartScreen" component={StartScreen} />
                            <Stack.Screen name="LoginScreen" component={LoginScreen} />
                            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
                            <Stack.Screen name="CodValidateScreen" component={CodValidateScreen} />
                            <Stack.Screen name="SetNewPasswordScreen" component={SetNewPasswordScreen} />
                        </>
                    )}

                </Stack.Navigator>
            </NavigationContainer>

            <FlashMessage position='top' />

        </Provider>
    )
}

export default Routes;