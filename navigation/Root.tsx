import React, {useCallback, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabsNav from './Tabs';
import AuthNav from './Auth';
import StackNav from './Stack';
import TeamNav from './Team';
import UserNav from './User';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {isLoggedIn} from '../recoil/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import {myInfoType, rstMyInfo} from '../recoil/user';
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {setTokenToAxios} from '../api';

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

export enum EncryptedStorageKeyList {
  USERINFO = 'USERINFO',
  TEAMSETTINGARR = 'TEAMSETTINGARR',
  ACCESSTOKEN = 'ACCESSTOKEN',
  REFRESHTOKEN = 'REFRESHTOKEN',
}

const Nav = createNativeStackNavigator();

const Root = () => {
  const [loggedIn, setLoggedIn] = useRecoilState(isLoggedIn);
  const setRstMyInfo = useSetRecoilState(rstMyInfo);
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const getUserInfo = useCallback(async () => {
    const userInfoString = await EncryptedStorage.getItem(
      EncryptedStorageKeyList.USERINFO,
    );
    if (userInfoString) {
      const userInfo: myInfoType = JSON.parse(userInfoString);
      setRstMyInfo(userInfo);
      await setTokenToAxios();
      setLoggedIn(true);
      if (userInfo.team) {
        const teamSettingString = await EncryptedStorage.getItem(
          EncryptedStorageKeyList.TEAMSETTINGARR,
        );

        if (teamSettingString) {
          const teamSettingArr = JSON.parse(teamSettingString);
          const teamSetting: {id: number; setting: boolean} =
            teamSettingArr.find(
              (teamObj: {id: number; setting: boolean}) =>
                teamObj.id === userInfo.team?.id,
            );
          console.log(teamSetting);
          if (teamSetting.setting) {
            return navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Tabs'}],
              }),
            );
          } else {
            return navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Stack'}],
              }),
            );
          }
        } else {
          return navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Stack'}],
            }),
          );
        }
      }
    }
  }, [setLoggedIn, setRstMyInfo, navigation]);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

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
