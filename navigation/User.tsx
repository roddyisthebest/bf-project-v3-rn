import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Penalty from '../screen/user/Detail/Penalty';
import Pray from '../screen/user/Detail/Pray';
import Tweet from '../screen/user/Detail/Tweet';
import Setting from '../screen/user/setting/index';
import Detail from '../screen/user/Detail/index';
import Profile from '../screen/user/setting/Profile';
import Service from '../screen/user/setting/Service';
const NativeStack = createNativeStackNavigator();

const UserNav = () => (
  <NativeStack.Navigator>
    <NativeStack.Screen name="Detail" component={Detail} />
    <NativeStack.Screen name="Penalty" component={Penalty} />
    <NativeStack.Screen name="Pray" component={Pray} />
    <NativeStack.Screen name="Tweet" component={Tweet} />
    <NativeStack.Screen name="Setting" component={Setting} />
    <NativeStack.Screen name="Profile" component={Profile} />
    <NativeStack.Screen name="Service" component={Service} />
  </NativeStack.Navigator>
);

export default UserNav;
