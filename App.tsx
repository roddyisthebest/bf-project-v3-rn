import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {RecoilRoot} from 'recoil';

import Root from './navigation/Root';

const App = () => {
  return (
    <NavigationContainer>
      <RecoilRoot>
        <Root />
      </RecoilRoot>
    </NavigationContainer>
  );
};

export default App;
