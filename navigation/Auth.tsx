import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Login from '../screen/auth/Login';
import Register from '../screen/auth/Register';

const NativeStack = createNativeStackNavigator();

const AuthNav = () => (
  <NativeStack.Navigator>
    <NativeStack.Screen name="Login" component={Login} />
    <NativeStack.Screen name="Register" component={Register} />
  </NativeStack.Navigator>
);

export default AuthNav;
