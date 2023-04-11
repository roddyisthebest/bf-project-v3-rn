import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RecoilRoot} from 'recoil';
import Root from './navigation/Root';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <RecoilRoot>
        <SafeAreaView style={{flex: 1}}>
          <Root />
        </SafeAreaView>
      </RecoilRoot>
    </NavigationContainer>
  );
};

export default App;
