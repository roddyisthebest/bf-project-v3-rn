import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabsNav from './Tabs';
import AuthNav from './Auth';
import StackNav from './Stack';
import TeamNav from './Team';
import UserNav from './User';

const Nav = createNativeStackNavigator();

const Root = () => (
  <Nav.Navigator
    initialRouteName="Auth"
    screenOptions={{
      presentation: 'modal',
      headerShown: false,
    }}>
    <Nav.Screen name="Tabs" component={TabsNav} />
    <Nav.Screen name="Auth" component={AuthNav} />
    <Nav.Screen name="Stack" component={StackNav} />
    <Nav.Screen name="Team" component={TeamNav} />
    <Nav.Screen name="User" component={UserNav} />
  </Nav.Navigator>
);

export default Root;
