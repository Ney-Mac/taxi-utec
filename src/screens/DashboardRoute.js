import React, { useContext } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { LogoutButton } from '../components/index';
import { AuthContext } from '../context/AuthContext';
import {
    ResetUserData,
    Dashboard,
    ChangeUserPassword,
    MyPointsScreen,
    FeedBackScreen,
} from './Dashboard/index';
import CodValidateScreen from './CodValidateScreen';

const DrawerStack = createDrawerNavigator();

const DashboardRoute = () => {
    const { logout, userInfo } = useContext(AuthContext);

    return (
        <DrawerStack.Navigator
            initialRouteName='Dashboard'
            screenOptions={{
                headerShown: false,
                drawerType: 'front',
                drawerPosition: 'right',
                drawerItemStyle: {
                    borderRadius: 20,
                    paddingLeft: 10,
                }
            }}
            drawerContent={props => (
                <DrawerContentScrollView>
                    <DrawerItemList {...props} />
                    <LogoutButton onPress={logout} > Sair </LogoutButton>
                </DrawerContentScrollView>
            )}
        >
            <DrawerStack.Screen name='Mapa' component={Dashboard} />
            {(userInfo?.user?.roles[0].name === 'informer') ?
                <DrawerStack.Screen name="Meus pontos" component={MyPointsScreen} /> : <></>
            }
            <DrawerStack.Screen name='Perfíl' component={ResetUserData} />
            <DrawerStack.Screen name="ChangeUserPassword" component={ChangeUserPassword} options={{ drawerItemStyle: { display: 'none' } }} />
            <DrawerStack.Screen name="CodValidateScreen" component={CodValidateScreen} options={{ drawerItemStyle: { display: 'none' } }} />
            <DrawerStack.Screen name="Contactar" component={FeedBackScreen} />
        </DrawerStack.Navigator>
    )
}

export default DashboardRoute;