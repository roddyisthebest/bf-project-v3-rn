import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Detail from '../screen/team/Detail/index';
import InvitationUser from '../screen/team/Detail/InvitationUser';
import TeamUser from '../screen/team/Detail/TeamUser';
import Service from '../screen/team/setting/Service';
import User from '../screen/team/setting/User';
import Team from '../screen/team/Team';
import TeamCreating from '../screen/team/TeamCreating';
import Profile from '../screen/team/setting/Profile';
const NativeStack = createNativeStackNavigator();

const TeamNav = () => (
  <NativeStack.Navigator>
    <NativeStack.Screen
      name="Home"
      component={Team}
      options={{title: 'My Team'}}
    />
    <NativeStack.Screen
      name="Creating"
      component={TeamCreating}
      options={{title: '팀 만들기'}}
    />
    <NativeStack.Screen name="ServiceSetting" component={Service} />
    <NativeStack.Screen
      name="UserSetting"
      component={User}
      options={{
        presentation: 'card',
      }}
    />
    <NativeStack.Screen name="InvitationUser" component={InvitationUser} />
    <NativeStack.Screen name="TeamUser" component={TeamUser} />
    <NativeStack.Screen name="Detail" component={Detail} />
    <NativeStack.Screen name="Profile" component={Profile} />
  </NativeStack.Navigator>
);

export default TeamNav;
