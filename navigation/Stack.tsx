import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Setting from '../screen/team/Setting';
import Uploading from '../screen/stack/Uploading';
const NativeStack = createNativeStackNavigator();

const StackNav = () => (
  <NativeStack.Navigator>
    <NativeStack.Screen name="FirstSetting" component={Setting} />
    <NativeStack.Screen name="Uploading" component={Uploading} />
  </NativeStack.Navigator>
);

export default StackNav;
