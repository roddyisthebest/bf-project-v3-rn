import React, {useEffect} from 'react';
import Layout from '../../components/layout';
import Setting from '../../components/container/Setting';
import {GapRowView} from '../../components/basic/View';
import {Switch} from 'react-native';
import Header from '../../components/container/Header';
import FastImage from 'react-native-fast-image';
function Team({
  navigation: {setOptions},
}: {
  navigation: {setOptions: Function};
}) {
  useEffect(() => {
    setOptions({
      headerTitle: () => (
        <FastImage
          source={require('../../assets/img/AppLogo512h.png')}
          style={{width: 30, height: 30}}
        />
      ),
      headerTitleAlign: 'center',
    });
  }, [setOptions]);

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
          <Switch />
        </Setting>
        <Setting
          title="기도제목"
          contents="기도제목을 업로드하고 수정 및 삭제 할 수 있습니다.">
          <Switch />
        </Setting>
        <Setting
          title="벌금"
          contents="매일 성경(큐티) 벌금 로직에 참여할 수 있습니다.">
          <Switch />
        </Setting>
      </GapRowView>
    </Layout>
  );
}

export default Team;
