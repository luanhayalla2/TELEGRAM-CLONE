import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import React, { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Theme from '../constants/Theme';
import CallsScreen from '../screens/CallsScreen';
import ChatScreens from '../screens/ChatScreens';
import CommunityScreen from '../screens/CommunityScreen';
import StatusScreen from '../screens/StatusScreen';

const Tab = createBottomTabNavigator();

type IconName = ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, label, focused }: { name: IconName; label: string; focused: boolean }) {
    const iconName = focused ? name : `${name}-outline` as any;
    
    return (
        <View style={styles.tabIconContainer}>
            <Ionicons 
                name={iconName} 
                size={24} 
                color={focused ? Theme.colors.primary : Theme.colors.placeholder} 
                style={styles.tabIcon}
            />
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
                    height: 65,
                    paddingBottom: 10,
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
                    tabBarIcon: ({ focused }) => <TabIcon name="chatbubbles" label="Chats" focused={focused} />,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Status"
                component={StatusScreen}
                options={{
                    title: 'STATUS',
                    tabBarIcon: ({ focused }) => <TabIcon name="aperture" label="Status" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="Communities"
                component={CommunityScreen}
                options={{
                    title: 'COMUNIDADES',
                    tabBarIcon: ({ focused }) => <TabIcon name="people" label="Comunidades" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="Calls"
                component={CallsScreen}
                options={{
                    title: 'LIGAÇÕES',
                    tabBarIcon: ({ focused }) => <TabIcon name="call" label="Chamadas" focused={focused} />,
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
        marginBottom: 2,
    },
    tabLabel: {
        fontSize: 10,
        color: Theme.colors.placeholder,
        marginTop: 2,
        fontWeight: '600',
    },
    tabLabelFocused: {
        color: Theme.colors.primary,
    },
});
