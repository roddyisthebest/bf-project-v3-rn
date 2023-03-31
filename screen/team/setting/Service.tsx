import React, {useCallback, useEffect, useState} from 'react';
import Layout from '../../../components/layout';
import Setting from '../../../components/container/Setting';
import {GapColumnView, GapRowView} from '../../../components/basic/View';
import {Pressable, Switch} from 'react-native';
import Header from '../../../components/container/Header';
import {Image} from '../../../components/basic/Image';
import {colors} from '../../../styles/color';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../recoil/user';
import {ButtonText} from '../../../components/basic/Button';
import styled from 'styled-components/native';
import {addService} from '../../../api/user';
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {LoggedInParamList} from '../../../navigation/Root';

const ModifiedView = styled(GapColumnView)`
  align-items: center;
`;
function Service() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const {team} = useRecoilValue(rstMyInfo);
  const [pray, setPray] = useState<boolean>(false);
  const [penalty, setPenalty] = useState<boolean>(false);
  const [tweet, setTweet] = useState<boolean>(false);

  const onPress = useCallback(async () => {
    try {
      await addService({
        tweet,
        penalty,
        pray,
        teamId: team?.id as number,
      });
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Tabs'}],
        }),
      );
    } catch (e) {
      // const {response} = e as unknown as AxiosError;
    }
  }, [team, navigation, tweet, penalty, pray]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <ModifiedView
          gap={10}
          marginBottom={0}
          marginTop={0}
          paddingHorizontal={0}
          paddingVertical={0}>
          <Image
            width={25}
            height={25}
            borderColor={colors.buttonBorderColor}
            borderRad={25}
            source={{uri: `http://192.168.123.104:3000/${team?.img}`}}
          />
          <ButtonText color="black" fontWeight={500} fontSize={20}>
            {team?.name}
          </ButtonText>
        </ModifiedView>
      ),
      headerRight: () => (
        <Pressable onPress={onPress}>
          <ButtonText color="#3478F6" fontSize={15} fontWeight={500}>
            확인
          </ButtonText>
        </Pressable>
      ),
    });
  }, [navigation, team, onPress]);

  return (
    <Layout scrollable={false} isItWhite={false}>
      <GapRowView
        gap={15}
        marginBottom={0}
        marginTop={0}
        paddingHorizontal={0}
        paddingVertical={0}>
        <Header
          title="기능 사용 설정"
          contents="This app provides private content.
Please enter a 6-digit code to prove yourself."
        />
        <Setting
          title="매일성경"
          contents="매일성경(큐티) 업로드를 사용할 수 있습니다. ">
          <Switch value={tweet} onValueChange={value => setTweet(value)} />
        </Setting>
        <Setting
          title="기도제목"
          contents="기도제목을 업로드하고 수정 및 삭제 할 수 있습니다.">
          <Switch value={pray} onValueChange={value => setPray(value)} />
        </Setting>
        <Setting
          title="벌금"
          contents="매일 성경(큐티) 벌금 로직에 참여할 수 있습니다.">
          <Switch value={penalty} onValueChange={value => setPenalty(value)} />
        </Setting>
      </GapRowView>
    </Layout>
  );
}

export default Service;
