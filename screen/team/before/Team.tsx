import React, {useCallback, useEffect, useState} from 'react';
import Layout from '../../../components/layout';
import TeamContainer from '../../../components/container/Team';
import InvitationContainer from '../../../components/container/Invitation';
import {GapRowView} from '../../../components/basic/View';
import {LoggedInParamList} from '../../../navigation/Root';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {getMyTeams, getMyThumbInvitations} from '../../../api/user';
import TeamType from '../../../types/TeamType';
import {useRecoilState} from 'recoil';
import {updateTeamFlag} from '../../../recoil/flag';
import MyInfo from '../../../components/parts/header/MyInfo';

import MyTeamMenu from '../../../components/parts/header/MyTeamMenu';
import InvitationType from '../../../types/InvitationType';

function Team() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const [flag, setFlag] = useRecoilState(updateTeamFlag);
  const [myTeams, setMyTeams] = useState<TeamType[]>([]);
  const [myInvitations, setMyInvitations] = useState<InvitationType[]>([]);
  const [myApplications, setMyApplications] = useState<InvitationType[]>([]);

  const setMyTeamsToState = useCallback(async () => {
    try {
      const {data} = await getMyTeams();
      setMyTeams(data.payload.Teams as TeamType[]);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const setMyInvitationsToState = useCallback(async () => {
    try {
      const {data} = await getMyThumbInvitations({active: true});
      console.log(data);
      setMyInvitations(data.payload as InvitationType[]);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const setMyApplicationToState = useCallback(async () => {
    try {
      const {data} = await getMyThumbInvitations({active: false});
      setMyApplications(data.payload as InvitationType[]);
    } catch (e) {
      console.log(e);
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
    if (flag) {
      setMyApplicationToState();
      setMyTeamsToState();
      setFlag(false);
    }
  }, [flag, setFlag, setMyTeams]);

  return (
    <Layout scrollable={false} isItWhite={false}>
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
    </Layout>
  );
}

export default Team;
