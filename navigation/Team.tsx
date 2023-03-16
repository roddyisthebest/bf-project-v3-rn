import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Detail from '../screen/team/Detail';
import Setting from '../screen/team/Setting';
import Team from '../screen/team/Team';
import TeamCreating from '../screen/team/TeamCreating';
const NativeStack = createNativeStackNavigator();

const TeamNav = () => (
  <NativeStack.Navigator>
    <NativeStack.Screen name="TeamHome" component={Team} />
    <NativeStack.Screen name="TeamCreating" component={TeamCreating} />
    <NativeStack.Screen name="TeamSetting" component={Setting} />
    <NativeStack.Screen name="TeamDetail" component={Detail} />
  </NativeStack.Navigator>
);

export default TeamNav;
