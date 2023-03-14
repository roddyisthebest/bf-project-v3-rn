import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import FastImage from 'react-native-fast-image';
import Login from '../screen/auth/Login';
import Register from '../screen/auth/Register';

const NativeStack = createNativeStackNavigator();

const AuthNav = () => (
  <NativeStack.Navigator
    screenOptions={{
      headerTitle: () => (
        <FastImage
          source={require('../assets/img/AppLogo512h.png')}
          style={{width: 30, height: 30}}
        />
      ),
      headerShadowVisible: false,
      contentStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
    }}>
    <NativeStack.Screen name="Login" component={Login} />
    <NativeStack.Screen name="Register" component={Register} />
  </NativeStack.Navigator>
);

export default AuthNav;
