import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import User from '../screen/user';
import Penalty from '../screen/user/Detail/Penalty';
import Pray from '../screen/user/Detail/Pray';
import Tweet from '../screen/user/Detail/Tweet';
import Setting from '../screen/user/index';
import Detail from '../screen/user/Detail/index';
import Edit from '../screen/user/setting/Edit';
import Usage from '../screen/user/setting/Usage';
const NativeStack = createNativeStackNavigator();

const UserNav = () => (
  <NativeStack.Navigator>
    <NativeStack.Screen name="Home" component={User} />
    <NativeStack.Screen name="Detail" component={Detail} />
    <NativeStack.Screen name="Penalty" component={Penalty} />
    <NativeStack.Screen name="Pray" component={Pray} />
    <NativeStack.Screen name="Tweet" component={Tweet} />
    <NativeStack.Screen name="Setting" component={Setting} />
    <NativeStack.Screen name="SettingEdit" component={Edit} />
    <NativeStack.Screen name="SettingUsage" component={Usage} />
  </NativeStack.Navigator>
);

export default UserNav;
