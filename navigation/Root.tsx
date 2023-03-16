import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabsNav from './Tabs';
import AuthNav from './Auth';
import StackNav from './Stack';
import TeamNav from './Team';
import UserNav from './User';
import {useRecoilValue} from 'recoil';
import {isLoggedIn} from '../recoil/auth';

export type LoggedInParamList = {
  Stack: {
    screen: 'Setting' | 'Uploading';
  };
  Tabs: {
    screen: 'Home' | 'Pray' | 'Penalty';
  };
  Team: {
    screen: 'Detail' | 'Setting' | 'Home' | 'Creating';
  };
  User: {
    screen:
      | 'Home'
      | 'Penalty'
      | 'Pray'
      | 'Tweet'
      | 'Setting'
      | 'SettingEdit'
      | 'SettingUsage';
  };
};

const Nav = createNativeStackNavigator();

const Root = () => {
  const loggedIn = useRecoilValue(isLoggedIn);

  return (
    <Nav.Navigator
      initialRouteName="Auth"
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
        headerTitleAlign: 'center',
      }}>
      {loggedIn ? (
        <>
          <Nav.Screen name="Team" component={TeamNav} />
          <Nav.Screen name="Tabs" component={TabsNav} />
          <Nav.Screen name="Stack" component={StackNav} />
          <Nav.Screen name="User" component={UserNav} />
        </>
      ) : (
        <Nav.Screen name="Auth" component={AuthNav} />
      )}
    </Nav.Navigator>
  );
};

export default Root;
