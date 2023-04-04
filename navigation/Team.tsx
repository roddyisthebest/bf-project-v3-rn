import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Detail from '../screen/team/after/Detail/index';
import InvitationUser from '../screen/team/after/Detail/InvitationUser';
import TeamUser from '../screen/team/after/Detail/TeamUser';
import Service from '../screen/team/after/setting/Service';
import User from '../screen/team/after/setting/User';
import Team from '../screen/team/before/Team';
import TeamCreating from '../screen/team/before/setting/TeamCreating';
import TeamSearching from '../screen/team/before/setting/TeamSearching';
import Profile from '../screen/team/after/setting/Profile';
import MyTeams from '../screen/team/before/Detail/MyTeams';
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
    <NativeStack.Screen
      name="Searching"
      component={TeamSearching}
      options={{title: '팀 검색'}}
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
    <NativeStack.Screen name="MyTeams" component={MyTeams} />
  </NativeStack.Navigator>
);

export default TeamNav;
