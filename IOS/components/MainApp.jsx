import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useContext } from 'react'
import AuthContext from '../contexts/authentication.js/AuthContext'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

//import screens
import LoginScreen from '../components/pages/LoginScreen'
import SignupScreen from '../components/pages/SignupScreen'
import HomeTab from '../components/pages/HomeTab'
import ProfileTab from '../components/pages/ProfileTab'
import CompletedTasksTab from '../components/pages/CompletedTasksTab'
import storage from '../consts/storage'
import Ionicons from '@expo/vector-icons/Ionicons'
import AddTask from './pages/AddTask'
const MainApp = () => {
    const { isAuthenticated, setAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const userInfo = await storage.load({
                    key: "userInfo"
                })
                if (userInfo) {
                    setAuthenticated(true);
                    return;
                }
                setAuthenticated(false);
            } catch (error) {
                setAuthenticated(false);
            }
        }
        checkUser();
    }, []);

    if (isAuthenticated) {
        return (
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        headerShown: false,
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;
                            if (route.name === 'home') {
                                iconName = focused ? 'home' : 'home-outline';
                            }
                            else if (route.name === 'completed') {
                                iconName = focused ? 'calendar' : 'calendar-outline';
                            }
                            else {
                                iconName = focused ? 'person' : 'person-outline';
                            }
                            return <Ionicons name={iconName} size={size} color={color} />
                        },
                        tabBarActiveTintColor: 'red',
                        tabBarInactiveTintColor: 'white',
                        tabBarShowLabel: false,
                        tabBarStyle: {
                            backgroundColor: "black",
                        }
                    })}
                    initialRouteName='home'>
                    <Tab.Screen name="home" component={HomeTab} />
                    <Tab.Screen name="completed" component={CompletedTasksTab} />
                    <Tab.Screen name="profile" component={ProfileTab} />
                </Tab.Navigator>
            </NavigationContainer>
        );
    }
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName='login'>
                <Stack.Screen name="login" component={LoginScreen} />
                <Stack.Screen name="signup" component={SignupScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default MainApp;