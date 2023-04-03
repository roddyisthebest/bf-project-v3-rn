import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Setting from '../screen/team/after/setting/Service';
import Uploading from '../screen/stack/Uploading';
const NativeStack = createNativeStackNavigator();

const StackNav = () => (
  <NativeStack.Navigator
    screenOptions={{
      presentation: 'fullScreenModal',
    }}>
    <NativeStack.Screen name="FirstSetting" component={Setting} />
    <NativeStack.Screen name="Uploading" component={Uploading} />
  </NativeStack.Navigator>
);

export default StackNav;
