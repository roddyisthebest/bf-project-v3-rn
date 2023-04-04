import React, {useCallback, useEffect, useState} from 'react';
import Layout from '../../../components/layout';
import TeamContainer from '../../../components/container/Team';
import {GapRowView} from '../../../components/basic/View';
import {LoggedInParamList} from '../../../navigation/Root';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {getMyTeams} from '../../../api/user';
import TeamType from '../../../types/TeamType';
import {useRecoilState} from 'recoil';
import {updateTeamFlag} from '../../../recoil/flag';
import MyInfo from '../../../components/parts/header/MyInfo';

import MyTeamMenu from '../../../components/parts/header/MyTeamMenu';

function Team() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const [flag, setFlag] = useRecoilState(updateTeamFlag);
  const [myTeams, setmyTeams] = useState<TeamType[]>([]);

  const getData = useCallback(async () => {
    try {
      const {data} = await getMyTeams();
      setmyTeams(data.payload.Teams as TeamType[]);
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
    getData();
  }, [getData]);

  useEffect(() => {
    if (flag) {
      getData();
      setFlag(false);
    }
  }, [flag, setFlag, getData]);

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
        <TeamContainer
          props={{
            title: '초대된 팀 📮',
            data: myTeams,
            type: 'invitation',
          }}
        />
        <TeamContainer
          props={{
            title: '가입 신청한 팀 😘',
            data: myTeams,
            type: 'apply',
          }}
        />
        {/* <TeamContainer title="초대된 팀 📮" /> */}
      </GapRowView>
    </Layout>
  );
}

export default Team;
