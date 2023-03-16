import {Pressable} from 'react-native';
import React, {useEffect} from 'react';
import Layout from '../../components/layout';
import TeamContainer from '../../components/container/Team';
import {GapRowView} from '../../components/basic/View';
import {ButtonText} from '../../components/basic/Button';
import {LoggedInParamList} from '../../navigation/Root';
import {NavigationProp, useNavigation} from '@react-navigation/native';

function Team() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

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

  return (
    <Layout scrollable={false} isItWhite={false}>
      <GapRowView
        gap={15}
        marginTop={0}
        marginBottom={0}
        paddingHorizontal={0}
        paddingVertical={0}>
        <TeamContainer title="나의 팀 🚀" />
        <TeamContainer title="초대된 팀 📮" />
      </GapRowView>
    </Layout>
  );
}

export default Team;
