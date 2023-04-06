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
import {rstTeamFlag} from '../../../recoil/flag';
import MyInfo from '../../../components/parts/header/MyInfo';

import MyTeamMenu from '../../../components/parts/header/MyTeamMenu';
import InvitationType from '../../../types/InvitationType';

function Team() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const [flag, setFlag] = useRecoilState(rstTeamFlag);
  const [myTeams, setMyTeams] = useState<TeamType[]>([]);
  const [myInvitations, setMyInvitations] = useState<InvitationType[]>([]);
  const [myApplications, setMyApplications] = useState<InvitationType[]>([]);

  const setMyTeamsToState = useCallback(async () => {
    try {
      const {data} = await getMyThumbTeams();
      setMyTeams(data.payload as TeamType[]);
      console.log('팀정보');
    } catch (e) {
      console.log(e);
    }
  }, []);

  const setMyInvitationsToState = useCallback(async () => {
    try {
      const {data} = await getMyThumbInvitations({active: true});
      setMyInvitations(data.payload as InvitationType[]);
      console.log('초대장정보');
    } catch (e) {
      console.log(e);
    }
  }, []);

  const setMyApplicationToState = useCallback(async () => {
    try {
      const {data} = await getMyThumbInvitations({active: false});
      setMyApplications(data.payload as InvitationType[]);
      console.log('가입신청정보');
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
