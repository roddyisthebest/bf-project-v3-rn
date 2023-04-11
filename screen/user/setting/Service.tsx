import React, {useCallback, useEffect, useState} from 'react';
import Layout from '../../../components/layout';
import Setting from '../../../components/container/Setting';
import {Alert, Pressable, Switch} from 'react-native';

import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../recoil/user';
import {ButtonText} from '../../../components/basic/Button';
import {getService} from '../../../api/user';

import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../../navigation/Root';
import {GapRowView} from '../../../components/basic/View';
import {updateService} from '../../../api/team';

function ServiceView() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const {team} = useRecoilValue(rstMyInfo);

  const [data, setData] = useState<{
    pray: boolean;
    penalty: boolean;
    tweet: boolean;
    id: number;
  }>({pray: false, penalty: false, tweet: false, id: 0});

  const [prevData, setPrevData] = useState<{
    pray: boolean;
    penalty: boolean;
    tweet: boolean;
  }>({pray: false, penalty: false, tweet: false});

  const getData = useCallback(async () => {
    const res = await getService({teamId: team?.id as number});
    setData(prev => ({
      ...prev,
      pray: res.data.payload.pray,
      penalty: res.data.payload.penalty,
      tweet: res.data.payload.tweet,
      id: res.data.payload.id,
    }));
    setPrevData({
      pray: res.data.payload.pray,
      penalty: res.data.payload.penalty,
      tweet: res.data.payload.tweet,
    });
  }, [team]);

  const onPress = useCallback(async () => {
    await updateService({
      tweet: data.tweet,
      penalty: data.penalty,
      pray: data.pray,
      teamId: team?.id as number,
      id: data.id,
    });

    setPrevData({tweet: data.tweet, penalty: data.penalty, pray: data.pray});
    Alert.alert('서비스 이용 정보가 변경되었습니다.');
  }, [team, navigation, data]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        data.tweet !== prevData.tweet ||
        data.penalty !== prevData.penalty ||
        data.pray !== prevData.pray ? (
          <Pressable onPress={onPress}>
            <ButtonText color="#3478F6" fontSize={15} fontWeight={500}>
              확인
            </ButtonText>
          </Pressable>
        ) : null,
    });
  }, [navigation, data, prevData, onPress]);

  useEffect(() => {
    getData();
  }, []);

  return (
    <Layout scrollable={false} isItWhite={false}>
      <GapRowView
        gap={15}
        marginBottom={0}
        marginTop={0}
        paddingHorizontal={0}
        paddingVertical={0}>
        <Setting
          title="매일성경"
          contents="매일성경(큐티) 업로드를 사용할 수 있습니다. ">
          <Switch
            value={data.tweet}
            onValueChange={value => setData(prev => ({...prev, tweet: value}))}
          />
        </Setting>
        <Setting
          title="기도제목"
          contents="기도제목을 업로드하고 수정 및 삭제 할 수 있습니다.">
          <Switch
            value={data.pray}
            onValueChange={value => setData(prev => ({...prev, pray: value}))}
          />
        </Setting>
        <Setting
          title="벌금"
          contents="매일 성경(큐티) 벌금 로직에 참여할 수 있습니다.">
          <Switch
            value={data.penalty}
            onValueChange={value =>
              setData(prev => ({...prev, penalty: value}))
            }
          />
        </Setting>
      </GapRowView>
    </Layout>
  );
}

export default ServiceView;
