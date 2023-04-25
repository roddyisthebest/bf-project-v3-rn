import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RecoilRoot} from 'recoil';
import Root, {
  DefaultParamList,
  EncryptedStorageKeyList,
} from './navigation/Root';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Platform} from 'react-native';

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

const App = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <RecoilRoot>
        <SafeAreaView style={{flex: 1}}>
          <Root />
        </SafeAreaView>
      </RecoilRoot>
    </NavigationContainer>
  );
};

export default App;
