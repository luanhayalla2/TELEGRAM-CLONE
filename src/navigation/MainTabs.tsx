import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Theme from '../constants/Theme';
import CallsScreen from '../screens/CallsScreen';
import ChatScreens from '../screens/ChatScreens';
import CommunityScreen from '../screens/CommunityScreen';
import StatusScreen from '../screens/StatusScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
    return (
        <View style={styles.tabIconContainer}>
            <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{icon}</Text>
            <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
        </View>
    );
}

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: Theme.colors.card,
                    borderBottomWidth: 1,
                    borderBottomColor: Theme.colors.border,
                },
                headerTitleStyle: {
                    color: Theme.colors.primary,
                    fontWeight: '900',
                    letterSpacing: 2,
                },
                tabBarStyle: {
                    backgroundColor: Theme.colors.card,
                    borderTopColor: Theme.colors.border,
                    height: 60,
                    paddingBottom: 8,
                },
                tabBarShowLabel: false,
                headerShadowVisible: false,
            }}
        >
            <Tab.Screen
                name="Chats"
                component={ChatScreens}
                options={{
                    title: 'CONVERSAS',
                    tabBarIcon: ({ focused }) => <TabIcon icon="💬" label="Chats" focused={focused} />,
                    headerShown: false, // ChatScreens handles its own header
                }}
            />
            <Tab.Screen
                name="Status"
                component={StatusScreen}
                options={{
                    title: 'STATUS',
                    tabBarIcon: ({ focused }) => <TabIcon icon="📡" label="Status" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="Communities"
                component={CommunityScreen}
                options={{
                    title: 'COMUNIDADES',
                    tabBarIcon: ({ focused }) => <TabIcon icon="🏘️" label="Comunidades" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="Calls"
                component={CallsScreen}
                options={{
                    title: 'LIGAÇÕES',
                    tabBarIcon: ({ focused }) => <TabIcon icon="📞" label="Chamadas" focused={focused} />,
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 8,
    },
    tabIcon: {
        fontSize: 20,
        opacity: 0.6,
    },
    tabIconFocused: {
        opacity: 1,
    },
    tabLabel: {
        fontSize: 10,
        color: Theme.colors.placeholder,
        marginTop: 4,
        fontWeight: '600',
    },
    tabLabelFocused: {
        color: Theme.colors.primary,
    },
});
