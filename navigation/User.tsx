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
    <NativeStack.Screen
      name="Detail"
      component={Detail}
      options={{title: '내 정보'}}
    />
    <NativeStack.Screen
      name="Penalty"
      component={Penalty}
      options={{title: '벌금 이력'}}
    />
    <NativeStack.Screen
      name="Pray"
      component={Pray}
      options={{title: '기도제목 이력'}}
    />
    <NativeStack.Screen
      name="Tweet"
      component={Tweet}
      options={{title: '매일성경 이력'}}
    />
    <NativeStack.Screen
      name="Setting"
      component={Setting}
      options={{title: '설정'}}
    />
    <NativeStack.Screen
      name="Profile"
      component={Profile}
      options={{title: '프로필 변경'}}
    />
    <NativeStack.Screen
      name="Service"
      component={Service}
      options={{title: '사용기능 수정'}}
    />
  </NativeStack.Navigator>
);

export default UserNav;
