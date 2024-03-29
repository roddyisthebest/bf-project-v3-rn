import React, {useCallback, useEffect, useState} from 'react';
import Layout from '../../../components/layout';
import TeamContainer from '../../../components/container/Team';
import InvitationContainer from '../../../components/container/Invitation';
import {GapRowView} from '../../../components/basic/View';
import {LoggedInParamList} from '../../../navigation/Root';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {getMyThumbInvitations, getMyThumbTeams} from '../../../api/user';
import TeamType from '../../../types/TeamType';
import {useRecoilState} from 'recoil';
import {rstNotificationFlag, rstTeamFlag} from '../../../recoil/flag';
import MyInfo from '../../../components/parts/header/MyInfo';

import MyTeamMenu from '../../../components/parts/header/MyTeamMenu';
import InvitationType from '../../../types/InvitationType';

import {FlatList, Platform} from 'react-native';
function Team() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const [flag, setFlag] = useRecoilState(rstTeamFlag);

  const [myTeams, setMyTeams] = useState<TeamType[]>([]);
  const [myInvitations, setMyInvitations] = useState<InvitationType[]>([]);
  const [myApplications, setMyApplications] = useState<InvitationType[]>([]);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [rstNotificationState, setRstNotificationState] =
    useRecoilState(rstNotificationFlag);

  const setMyTeamsToState = useCallback(async () => {
    const {data} = await getMyThumbTeams();
    setMyTeams(data.payload as TeamType[]);
    console.log('팀정보');
  }, []);

  const setMyInvitationsToState = useCallback(async () => {
    const {data} = await getMyThumbInvitations({active: true});
    setMyInvitations(data.payload as InvitationType[]);
    console.log('초대장정보');
  }, []);

  const setMyApplicationToState = useCallback(async () => {
    const {data} = await getMyThumbInvitations({active: false});
    setMyApplications(data.payload as InvitationType[]);
    console.log('가입신청정보');
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setMyTeamsToState();
      setMyInvitationsToState();
      setMyApplicationToState();
    } catch (e) {
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MyInfo />,
      headerRight: () => <MyTeamMenu />,
    });
  }, [navigation]);

  useEffect(() => {
    setMyTeamsToState();
    setMyInvitationsToState();
    setMyApplicationToState();
  }, []);

  useEffect(() => {
    if (flag.home.update.myteam) {
      setMyTeamsToState();
      setFlag(prev => ({
        home: {
          update: {
            application: prev.home.update.application,
            invitation: prev.home.update.invitation,
            myteam: false,
          },
        },
      }));
    }
  }, [flag.home.update.myteam, setFlag]);

  useEffect(() => {
    if (flag.home.update.invitation) {
      setMyInvitationsToState();
      setFlag(prev => ({
        home: {
          update: {
            application: prev.home.update.application,
            invitation: false,
            myteam: prev.home.update.myteam,
          },
        },
      }));
    }
  }, [flag.home.update.invitation, setFlag]);

  useEffect(() => {
    if (flag.home.update.application) {
      setMyApplicationToState();
      setFlag(prev => ({
        home: {
          update: {
            application: false,
            invitation: prev.home.update.invitation,
            myteam: prev.home.update.myteam,
          },
        },
      }));
    }
  }, [flag.home.update.application, setFlag]);

  useEffect(() => {
    if (rstNotificationState === 'invitation:post') {
      navigation.navigate('Team', {screen: 'InvitedTeams'});
    }
    if (rstNotificationState === 'application:delete') {
      navigation.navigate('Team', {screen: 'AppliedTeams'});
    }

    if (
      Platform.OS === 'android' &&
      rstNotificationState === 'invitation:post'
    ) {
      setTimeout(() => {
        navigation.navigate('Team', {screen: 'InvitedTeams'});
      }, 100);
    }

    if (
      Platform.OS === 'android' &&
      rstNotificationState === 'application:delete'
    ) {
      setTimeout(() => {
        navigation.navigate('Team', {screen: 'AppliedTeams'});
      }, 100);
    }

    setRstNotificationState(null);
  }, [navigation, rstNotificationState]);

  return (
    <Layout scrollable={false} isItWhite={false}>
      <FlatList
        data={[]}
        renderItem={null}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <GapRowView
            gap={15}
            marginTop={0}
            marginBottom={0}
            paddingHorizontal={0}
            paddingVertical={0}>
            <TeamContainer
              props={{
                title: '나의 팀 🚀',
                data: myTeams,
                type: 'default',
              }}
            />
            <InvitationContainer
              props={{
                title: '초대된 팀 📮',
                data: myInvitations,
                type: 'invitation',
              }}
            />
            <InvitationContainer
              props={{
                title: '가입 신청한 팀 😘',
                data: myApplications,
                type: 'apply',
              }}
            />
          </GapRowView>
        }
      />
    </Layout>
  );
}

export default Team;
