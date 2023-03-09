import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import User from '../screen/user';
import Penalty from '../screen/user/Penalty';
import Pray from '../screen/user/Pray';
import Tweet from '../screen/user/Tweet';
import Setting from '../screen/user/index';
import Edit from '../screen/user/setting/Edit';
import Usage from '../screen/user/setting/Usage';
const NativeStack = createNativeStackNavigator();

const UserNav = () => (
  <NativeStack.Navigator>
    <NativeStack.Screen name="User" component={User} />
    <NativeStack.Screen name="UserPenalty" component={Penalty} />
    <NativeStack.Screen name="UserPray" component={Pray} />
    <NativeStack.Screen name="UserTweet" component={Tweet} />
    <NativeStack.Screen name="UserSetting" component={Setting} />
    <NativeStack.Screen name="UserSettingEdit" component={Edit} />
    <NativeStack.Screen name="UserSettingUsage" component={Usage} />
  </NativeStack.Navigator>
);

export default UserNav;
