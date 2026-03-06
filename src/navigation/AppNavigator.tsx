import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Theme from '../constants/Theme';
import ChatScreens from '../screens/ChatScreens';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
                headerStyle: {
                    backgroundColor: Theme.colors.background,
                },
                headerTintColor: Theme.colors.text,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: 'NEXORA' }}
            />
            <Stack.Screen
                name="Chat"
                component={ChatScreens}
                options={{ title: 'NEXORA' }}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Perfil do Usuário' }}
            />
        </Stack.Navigator>
    );
}
