import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RecoilRoot} from 'recoil';
import Root, {
  AsyncStorageKeyList,
  DefaultParamList,
  EncryptedStorageKeyList,
} from './navigation/Root';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Platform} from 'react-native';
import CodePush, {CodePushOptions} from 'react-native-code-push';
import IntroSlider from './components/view/IntroSlider';
import SplashScreen from 'react-native-splash-screen';

import AsyncStorage from '@react-native-async-storage/async-storage';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

export const navigationRef =
  React.createRef<NavigationContainerRef<DefaultParamList>>();

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: async function (notification) {
    console.log('알림!!!!!');

    console.log('NOTIFICATION:', notification);

    if (!notification.foreground) {
      const code = notification.data.code;
      if (
        code === 'invitation:post' ||
        code === 'application:delete' ||
        code === 'application:approve' ||
        code === 'penalty:set' ||
        code === 'tweet:warning'
      ) {
        if (Platform.OS === 'ios' && notification.action) {
          // (required) Called when a remote is received or opened, or local notification is opened
          notification.finish(PushNotificationIOS.FetchResult.NoData);
          console.log('ios', notification.data);
          return navigationRef.current?.navigate('Notification', {
            params: {
              data: notification.data,
            },
          });
        }

        if (Platform.OS === 'android') {
          const obj: any = {};

          obj.code = code;
          if (notification.data.team) {
            obj.team = JSON.parse(notification.data.team);
          }

          await EncryptedStorage.setItem(
            EncryptedStorageKeyList.PUSHNOTIFICATION,
            JSON.stringify(obj),
          );
        }
      }
    }
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log('액션!!!');

    console.log('ACTION:', notification.action);

    console.log('NOTIFICATION:', notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

PushNotification.createChannel(
  {
    channelId: 'join',
    channelName: '가입 알림',
    channelDescription: '가입 관련 알림입니다.',
    soundName: 'default',
    importance: 1,
    vibrate: true,
  },
  (created: boolean) => console.log(`createChannel join returned ${created}`),
);

PushNotification.createChannel(
  {
    channelId: 'penalty',
    channelName: '벌금 알림',
    channelDescription: '벌금 관련 알림입니다.',
    soundName: 'default',
    importance: 2,
    vibrate: true,
  },
  (created: boolean) =>
    console.log(`createChannel penalty returned ${created}`),
);

PushNotification.createChannel(
  {
    channelId: 'default',
    channelName: '기본 알림',
    channelDescription: '기본적인 알림입니다.',
    soundName: 'default',
    importance: 2,
    vibrate: true,
  },
  (created: boolean) =>
    console.log(`createChannel default returned ${created}`),
);

const codePushOptions: CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  // 언제 업데이트를 체크하고 반영할지를 정한다.
  // ON_APP_RESUME은 Background에서 Foreground로 오는 것을 의미
  // ON_APP_START은 앱이 실행되는(켜지는) 순간을 의미
  installMode: CodePush.InstallMode.IMMEDIATE,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
  // 업데이트를 어떻게 설치할 것인지 (IMMEDIATE는 강제설치를 의미)
};
const App = () => {
  const [visibility, setVisibility] = useState<boolean>(false);

  const checkIntroRc = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem(
        AsyncStorageKeyList.DEFAULT_INTRO_RC,
      );
      if (value === null) {
        setVisibility(true);
      }
    } catch (e) {
      // error reading value
    }
  }, []);
  useEffect(() => {
    CodePush.sync(
      {
        installMode: CodePush.InstallMode.IMMEDIATE,
        mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
        updateDialog: {
          mandatoryUpdateMessage:
            '필수 업데이트가 있어 설치 후 앱을 재시작합니다.',
          mandatoryContinueButtonLabel: '재시작',
          optionalIgnoreButtonLabel: '나중에',
          optionalInstallButtonLabel: '재시작',
          optionalUpdateMessage: '업데이트가 있습니다. 설치하시겠습니까?',
          title: '업데이트 안내',
        },
      },
      status => {
        console.log(`Changed ${status}`);
      },
    ).then(status => {
      console.log(`CodePush ${status}`);
    });
    const unsubscribe = () =>
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000);
    unsubscribe();

    checkIntroRc();
    return () => clearTimeout(unsubscribe);
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <RecoilRoot>
        <SafeAreaView style={{flex: 1}}>
          {visibility ? (
            <IntroSlider
              visibility={visibility}
              setVisibility={setVisibility}
            />
          ) : (
            <Root />
          )}
        </SafeAreaView>
      </RecoilRoot>
    </NavigationContainer>
  );
};

export default CodePush(codePushOptions)(App);
