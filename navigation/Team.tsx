import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Detail from '../screen/team/Detail';
import Setting from '../screen/team/Setting';
import Team from '../screen/team/Team';
import TeamCreating from '../screen/team/TeamCreating';

const NativeStack = createNativeStackNavigator();

const TeamNav = () => (
  <NativeStack.Navigator>
    <NativeStack.Screen
      name="Home"
      component={Team}
      options={{title: 'My Team'}}
    />
    <NativeStack.Screen name="Creating" component={TeamCreating} />
    <NativeStack.Screen name="Setting" component={Setting} />
    <NativeStack.Screen name="Detail" component={Detail} />
  </NativeStack.Navigator>
);

export default TeamNav;
