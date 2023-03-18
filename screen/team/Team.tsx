import {Alert, Pressable} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Layout from '../../components/layout';
import TeamContainer from '../../components/container/Team';
import {GapRowView} from '../../components/basic/View';
import {ButtonText} from '../../components/basic/Button';
import {LoggedInParamList} from '../../navigation/Root';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {getMyTeams} from '../../api/user';
import {setTokenToAxios} from '../../api';
import TeamType from '../../types/TeamType';
import {useRecoilState} from 'recoil';
import {addTeamFlag} from '../../recoil/flag';

function Team() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const [flag, setFlag] = useRecoilState(addTeamFlag);
  const [myTeams, setmyTeams] = useState<TeamType[]>([]);

  const getData = useCallback(async () => {
    try {
      await setTokenToAxios();
      const {data} = await getMyTeams();
      setmyTeams(data.payload.Teams as TeamType[]);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate('Team', {screen: 'Creating'})}>
          <ButtonText color="#3478F6" fontSize={12.5}>
            팀 만들기
          </ButtonText>
        </Pressable>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (flag) {
      getData();
      Alert.alert('팀이 생성되었습니다.');
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
          }}
        />

        {/* <TeamContainer title="초대된 팀 📮" /> */}
      </GapRowView>
    </Layout>
  );
}

export default Team;
