import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import Authentification, {configs} from "./components/Authentification";
import {NavigationActions as navigation} from "react-navigation";

import Ionicons from "react-native-vector-icons/Ionicons";

import Home from "./components/Home";
import Trends from "./components/Trends/Trends";
import Profile from "./components/Profile";
import UserSettings from "./components/UserSettings";
import Sub from "./components/Sub/Sub";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {SafeAreaView, View} from "react-native";
import Search from "./components/Search";

export const Tab = createBottomTabNavigator();

export const nav = {
    navigation: navigation
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.componentRef = React.createRef();

    this.state =  {
        accessToken: 'n/a',
    }
  }

  render() {

      const navi = navigation;
    return this.state.accessToken === 'n/a' ?
    (
        <Authentification navigation={navigation} onConnect={(tok) => {
            this.setState({accessToken: tok})
        }}></Authentification>
    )
        :
        (
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;
                            if (route.name === 'Dashboard')
                                iconName = focused ? 'ios-albums-sharp' : 'ios-albums-outline';
                            else if (route.name === 'Subs')
                                iconName = focused ? 'ios-earth' : 'ios-earth-outline';
                            else if (route.name === 'Profile')
                                iconName = 'ios-logo-reddit';
                            else if (route.name === 'Settings')
                                iconName = focused ? 'ios-cog' : 'ios-cog-outline';
                            else if (route.name === 'Search')
                                iconName = focused ? 'ios-search' : 'ios-search-outline';
                            return <Ionicons name={iconName} size={size} color={color} />;
                        },

                        tabBarActiveTintColor: '#FF4B3E',
                        tabBarInactiveTintColor: 'gray',
                        tabBarStyle: {position: 'absolute'}
                    })}>
                    <Tab.Screen name="Dashboard" children={()=><Home token={configs.reddit.accessToken} navigation={navi}/>} />
                    <Tab.Screen name="Subs" children={()=><Trends token={configs.reddit.accessToken}/>} />
                    <Tab.Screen name="Search" children={()=><Search token={configs.reddit.accessToken}/>} />
                    <Tab.Screen name="Profile" children={()=><Profile token={configs.reddit.accessToken}/>} />
                    <Tab.Screen name="Settings" children={()=><UserSettings token={configs.reddit.accessToken}/>}  />

                </Tab.Navigator>
            </NavigationContainer>
        );
  }
}