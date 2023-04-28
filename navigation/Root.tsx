import React, {useCallback, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabsNav from './Tabs';
import AuthNav from './Auth';
import TeamNav from './Team';
import UserNav from './User';
import {useRecoilState, useResetRecoilState, useSetRecoilState} from 'recoil';
import {rstAuth} from '../recoil/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import {rstMyInfoType, rstMyInfo} from '../recoil/user';
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {api, setTokenToAxios} from '../api';
import axios, {AxiosError} from 'axios';
import {response as responseType} from '../api';
import {Alert, Platform} from 'react-native';
import {getTokenByRefresh} from '../util/Func';
import {getTeam} from '../api/team';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import {setPhoneToken} from '../api/user';
import {rstNotificationFlag, rstTeamFlag} from '../recoil/flag';
import Notification from '../screen/notification';
import Config from 'react-native-config';
import NtDataType from '../types/NtDataType';
import TeamType from '../types/TeamType';

export type DefaultParamList = {
  Notification: {
    params: {};
  };
};

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
  PUSHNOTIFICATION = 'PUSHNOTIFICATION',
}

const Nav = createNativeStackNavigator();

const Root = () => {
  const [rstAuthState, setRstAuthState] = useRecoilState(rstAuth);
  const [rstMyInfoState, setRstMyInfoState] = useRecoilState(rstMyInfo);

  const setRstNotificationFlag = useSetRecoilState(rstNotificationFlag);

  const setRstTeamFlag = useSetRecoilState(rstTeamFlag);
  const resetRstMyInfo = useResetRecoilState(rstMyInfo);
  const resetRstAuth = useResetRecoilState(rstAuth);

  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const onCreate = useCallback(async () => {
    console.log(Platform.OS, Config.API_URL);
    const res = await getTokenByRefresh();
    if (!res) {
      return;
    }
    setRstAuthState(true);

    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
    }
    const phoneToken = await messaging().getToken();
    console.log('phoneToken', phoneToken);
    await setPhoneToken({phoneToken});

    const userInfoString = await EncryptedStorage.getItem(
      EncryptedStorageKeyList.USERINFO,
    );

    if (userInfoString) {
      const userInfo: rstMyInfoType = JSON.parse(userInfoString);
      setRstMyInfoState(userInfo);
      const pushNotificationString = await EncryptedStorage.getItem(
        EncryptedStorageKeyList.PUSHNOTIFICATION,
      );
      console.log(pushNotificationString, 'android');

      if (pushNotificationString) {
        await EncryptedStorage.removeItem(
          EncryptedStorageKeyList.PUSHNOTIFICATION,
        );
      }

      if (
        userInfo.team &&
        (!pushNotificationString || pushNotificationString === null)
      ) {
        console.log('default kind');
        const {data} = await getTeam({id: userInfo?.team?.id as number});
        userInfo.team = data.payload;

        await EncryptedStorage.setItem(
          EncryptedStorageKeyList.USERINFO,
          JSON.stringify(userInfo),
        );
        setRstMyInfoState(userInfo);

        return navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Tabs'}],
          }),
        );
      }

      if (Platform.OS === 'android') {
        const parsedPushNotification: NtDataType = JSON.parse(
          pushNotificationString as string,
        );

        setRstNotificationFlag(parsedPushNotification.code);
        console.log(parsedPushNotification.code, 'Root');
        if (
          parsedPushNotification?.code?.includes('invitation') ||
          parsedPushNotification?.code?.includes('application')
        ) {
          console.log(
            'parsedPushNotification.code',
            parsedPushNotification.code,
          );
          return teamReset();
        }

        if (parsedPushNotification.code === 'penalty:set') {
          teamSet(userInfoString, parsedPushNotification.team as TeamType);

          return navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Tabs', params: {screen: 'Penalty'}}],
            }),
          );
        }
        if (parsedPushNotification.code === 'tweet:warning') {
          teamSet(userInfoString, parsedPushNotification.team as TeamType);
          return navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Tabs'}],
            }),
          );
        }
        console.log('ok-end');
      }
      console.log('hello');
    }
  }, [setRstAuthState, setRstMyInfoState, navigation, setRstNotificationFlag]);

  const teamReset = useCallback(async () => {
    await EncryptedStorage.setItem(
      EncryptedStorageKeyList.USERINFO,
      JSON.stringify({user: rstMyInfoState.user, team: null}),
    );
    setRstMyInfoState(prev => ({user: prev.user, team: null}));
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Team'}],
      }),
    );
  }, [navigation, setRstMyInfoState]);

  const teamSet = async (userInfoString: string, team: TeamType) => {
    const userInfo: rstMyInfoType = JSON.parse(userInfoString);

    userInfo.team = team;
    setRstMyInfoState(prev => ({
      ...prev,
      team,
    }));
    await EncryptedStorage.setItem(
      EncryptedStorageKeyList.USERINFO,
      JSON.stringify(userInfo),
    );
  };

  const logout = useCallback(async () => {
    await EncryptedStorage.clear();
    resetRstAuth();
    resetRstMyInfo();
  }, []);

  useEffect(() => {
    api.interceptors.response.use(
      res => {
        return res;
      },
      async error => {
        const {response, config} = error as unknown as AxiosError<responseType>;

        const originalRequest: any = config;

        const message = response?.data.message as string;
        const code = response?.data?.code;
        const status = response?.status;

        console.log(code, status);
        if (status !== 401 && code !== 'Expired:AccessToken') {
          Alert.alert(message);
          console.log(status, code);
        }

        if (status === 403) {
          if (code === 'Forbidden:AuthTeam') {
            teamReset();
          }
        } else if (status === 400 && code === 'Bad Request:Token') {
          logout();
        } else if (status === 401) {
          if (
            code === 'Invalid AccessToken'
            // code === 'Invalid RefreshToken' ||
            // code === 'Expired:RefreshToken'
          ) {
            logout();
          } else if (code === 'Expired:AccessToken') {
            // 엑세스 토큰 리프레시 로직
            const refreshToken = await EncryptedStorage.getItem(
              EncryptedStorageKeyList.REFRESHTOKEN,
            );
            if (refreshToken) {
              try {
                const {data}: {data: {payload: {accessToken: string}}} =
                  await axios.post(`${Config.API_URL}/token/refresh`, {
                    refreshToken,
                  });

                await EncryptedStorage.setItem(
                  EncryptedStorageKeyList.ACCESSTOKEN,
                  data.payload.accessToken,
                );

                await setTokenToAxios();
                originalRequest.headers.Authorization =
                  data.payload.accessToken;

                return axios(originalRequest);
              } catch (axiosError) {
                const {response: axiosResponse} =
                  axiosError as unknown as AxiosError<responseType>;
                Alert.alert(axiosResponse?.data?.message as string);

                logout();
              }
            } else {
              logout();
            }
          }
        } else if (status === 404 && code === 'Not Found:Team') {
          teamReset();
        } else if (status === 500) {
          Alert.alert('서버오류', '관리자에게 문의바랍니다.');
          logout();
        }
        return Promise.reject(error);
      },
    );
  }, []);

  useEffect((): (() => void) => {
    onCreate();

    const unsubscribe = () =>
      setTimeout(() => {
        SplashScreen.hide();
      }, 2500);
    unsubscribe();

    return () => clearTimeout(unsubscribe);
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.data?.code === 'invitation:post') {
        setRstTeamFlag(prev => ({
          ...prev,
          home: {
            update: {
              ...prev.home.update,
              invitation: true,
            },
          },
        }));
      } else if (remoteMessage.data?.code === 'application:delete') {
        setRstTeamFlag(prev => ({
          ...prev,
          home: {
            update: {
              ...prev.home.update,
              application: true,
            },
          },
        }));
      } else if (remoteMessage.data?.code === 'application:approve') {
        setRstTeamFlag(prev => ({
          ...prev,
          home: {
            update: {
              ...prev.home.update,
              application: true,
              myteam: true,
            },
          },
        }));
      } else if (
        remoteMessage.data?.code === 'team:dropout' &&
        rstMyInfoState.team?.id === parseInt(remoteMessage.data?.teamId, 10)
      ) {
        teamReset();
      }
      Alert.alert(
        remoteMessage.notification?.title as string,
        remoteMessage.notification?.body,
      );
    });
    return unsubscribe;
  }, [setRstTeamFlag, rstMyInfoState]);

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
              headerTitleAlign: 'center',
            }}
          />
          <Nav.Screen name="Tabs" component={TabsNav} />
          <Nav.Screen name="User" component={UserNav} />
        </>
      ) : (
        <Nav.Screen name="Auth" component={AuthNav} />
      )}
      <Nav.Screen name="Notification" component={Notification} />
    </Nav.Navigator>
  );
};

export default Root;
