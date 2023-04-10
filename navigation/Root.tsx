import React, {useCallback, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabsNav from './Tabs';
import AuthNav from './Auth';
import TeamNav from './Team';
import UserNav from './User';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {rstAuth} from '../recoil/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import {rstMyInfoType, rstMyInfo} from '../recoil/user';
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {setTokenToAxios} from '../api';

export type LoggedInParamList = {
  Tabs: {
    screen: 'Home' | 'Pray' | 'Penalty';
  };
  Team: {
    screen:
      | 'Detail'
      | 'ServiceSetting'
      | 'Home'
      | 'Creating'
      | 'Searching'
      | 'UserSetting'
      | 'InvitationUser'
      | 'ApplicationUser'
      | 'TeamUser'
      | 'Profile'
      | 'MyTeams'
      | 'InvitedTeams'
      | 'AppliedTeams';
  };
  User: {
    screen:
      | 'Penalty'
      | 'Pray'
      | 'Tweet'
      | 'Setting'
      | 'Profile'
      | 'Service'
      | 'Detail';
  };
};

export type UnLoggedInParamList = {
  Auth: {
    screen: 'Login';
  };
};

export enum EncryptedStorageKeyList {
  USERINFO = 'USERINFO',
  ACCESSTOKEN = 'ACCESSTOKEN',
  REFRESHTOKEN = 'REFRESHTOKEN',
}

const Nav = createNativeStackNavigator();

const Root = () => {
  const [rstAuthState, setRstAuthState] = useRecoilState(rstAuth);
  const setRstMyInfo = useSetRecoilState(rstMyInfo);
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const getUserInfo = useCallback(async () => {
    const userInfoString = await EncryptedStorage.getItem(
      EncryptedStorageKeyList.USERINFO,
    );
    if (userInfoString) {
      const userInfo: rstMyInfoType = JSON.parse(userInfoString);
      setRstMyInfo(userInfo);
      await setTokenToAxios();
      setRstAuthState(true);
      if (userInfo.team) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Tabs'}],
          }),
        );
      }
    }
  }, [setRstAuthState, setRstMyInfo, navigation]);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return (
    <Nav.Navigator
      initialRouteName="Auth"
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
      }}>
      {rstAuthState ? (
        <>
          <Nav.Screen
            name="Team"
            component={TeamNav}
            options={{
              presentation: 'card',
            }}
          />
          <Nav.Screen name="Tabs" component={TabsNav} />
          <Nav.Screen name="User" component={UserNav} />
        </>
      ) : (
        <Nav.Screen name="Auth" component={AuthNav} />
      )}
    </Nav.Navigator>
  );
};

export default Root;
