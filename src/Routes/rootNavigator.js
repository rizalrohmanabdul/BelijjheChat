import React, {Component} from 'react';
import {
  createAppContainer,
  createMaterialTopTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
} from 'react-navigation';
import Dashboard from '../Screen/Dashboard'
import Listchat from '../Screen/ListChat'
import PersonChat from '../Screen/PersonChat'
import Register from '../Screen/Register'
import Login from '../Screen/Login'
import AuthPage from '../Component/AuthPage'


export default createAppContainer(
  createSwitchNavigator(
    {
        Dashboard: Dashboard,
        Listchat: Listchat,
        PersonChat:PersonChat,
        Register:Register,
        Login:Login,
        AuthPage:AuthPage
    },
    {
      initialRouteName: 'AuthPage',
      headerMode: 'none',
    },
  ),
);

