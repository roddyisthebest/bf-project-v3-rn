import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import Detail from '../screen/team/after/Detail/index';
import InvitationUser from '../screen/team/after/Detail/InvitationUser';
import TeamUser from '../screen/team/after/Detail/TeamUser';
import User from '../screen/team/after/setting/User';
import Team from '../screen/team/before/Team';
import TeamCreating from '../screen/team/before/setting/TeamCreating';
import TeamSearching from '../screen/team/before/setting/TeamSearching';
import Profile from '../screen/team/after/setting/Profile';
import MyTeams from '../screen/team/before/Detail/MyTeams';
import InvitedTeams from '../screen/team/before/Detail/InvitedTeams';
import AppliedTeams from '../screen/team/before/Detail/AppliedTeams';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../recoil/user';
import ApplicationUser from '../screen/team/after/Detail/ApplicationUser';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from './Root';
import {Platform, TouchableNativeFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NativeStack = createNativeStackNavigator();

const TeamNav = () => {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const {team} = useRecoilValue(rstMyInfo);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <NativeStack.Navigator initialRouteName="Detail">
      {team ? (
        <>
          <NativeStack.Screen
            name="UserSetting"
            component={User}
            options={{title: '팀원 초대'}}
          />
          <NativeStack.Screen
            name="InvitationUser"
            component={InvitationUser}
            options={{title: '초대한 유저 리스트'}}
          />
          <NativeStack.Screen
            name="ApplicationUser"
            component={ApplicationUser}
            options={{title: '가입 신청한 유저 리스트'}}
          />
          <NativeStack.Screen
            name="TeamUser"
            component={TeamUser}
            options={{title: '팀원 리스트'}}
          />
          <NativeStack.Screen
            name="Detail"
            component={Detail}
            options={{
              headerLeft: () => (
                <TouchableNativeFeedback onPress={goBack}>
                  {Platform.OS === 'ios' ? (
                    <Icon name="chevron-back-outline" color="black" size={25} />
                  ) : (
                    <Icon name="arrow-back-outline" color="black" size={25} />
                  )}
                </TouchableNativeFeedback>
              ),
              title: '팀 정보',
            }}
          />
          <NativeStack.Screen
            name="Profile"
            component={Profile}
            options={{title: '팀 프로필 변경'}}
          />
        </>
      ) : (
        <>
          <NativeStack.Screen
            name="Home"
            component={Team}
            options={{title: '팀'}}
          />
          <NativeStack.Screen
            name="Creating"
            component={TeamCreating}
            options={{title: '팀 생성'}}
          />
          <NativeStack.Screen
            name="Searching"
            component={TeamSearching}
            options={{title: '팀 검색'}}
          />
          <NativeStack.Screen
            name="MyTeams"
            component={MyTeams}
            options={{title: '나의 팀'}}
          />
          <NativeStack.Screen
            name="InvitedTeams"
            component={InvitedTeams}
            options={{title: '초대된 팀'}}
          />
          <NativeStack.Screen
            name="AppliedTeams"
            component={AppliedTeams}
            options={{title: '가입 신청한 팀'}}
          />
        </>
      )}
    </NativeStack.Navigator>
  );
};

export default TeamNav;
