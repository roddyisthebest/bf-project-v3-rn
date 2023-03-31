import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RecoilRoot} from 'recoil';
import Root from './navigation/Root';

const App = () => {
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
