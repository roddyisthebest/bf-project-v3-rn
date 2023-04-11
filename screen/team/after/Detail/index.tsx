import {Alert, FlatList, View} from 'react-native';
import React, {useCallback} from 'react';
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {
  EncryptedStorageKeyList,
  LoggedInParamList,
} from '../../../../navigation/Root';
import Layout from '../../../../components/layout';
import {GapRowView} from '../../../../components/basic/View';
import DetailHeader from '../../../../components/container/DetailHeader';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {rstMyInfoType, rstMyInfo} from '../../../../recoil/user';
import TeamType from '../../../../types/TeamType';
import {ButtonText, SmButton} from '../../../../components/basic/Button';
import {colors} from '../../../../styles/color';
import NavItem from '../../../../components/parts/detail/NavItem';
import {deleteTeam, withdraw} from '../../../../api/team';
import EncryptedStorage from 'react-native-encrypted-storage/';
import {rstTeamFlag} from '../../../../recoil/flag';
function Detail() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const [userInfo, setUserInfo] = useRecoilState(rstMyInfo);
  const setFlag = useSetRecoilState(rstTeamFlag);
  const data = [
    {
      id: 1,
      text: '팀원 초대',
      onPress: () => {
        navigation.navigate('Team', {screen: 'UserSetting'});
      },
    },
    {
      id: 2,
      text: '팀원 리스트',
      onPress: () => {
        navigation.navigate('Team', {screen: 'TeamUser'});
      },
    },
    {
      id: 3,
      text: '초대한 유저 리스트 ',
      onPress: () => {
        navigation.navigate('Team', {screen: 'InvitationUser'});
      },
    },
    {
      id: 4,
      text: '가입 신청한 유저 리스트',
      onPress: () => {
        navigation.navigate('Team', {screen: 'ApplicationUser'});
      },
    },
  ];

  const resetTeam = async () => {
    const stringData = await EncryptedStorage.getItem(
      EncryptedStorageKeyList.USERINFO,
    );

    const parsedData: rstMyInfoType = JSON.parse(stringData as string);

    parsedData.team = null;

    await EncryptedStorage.setItem(
      EncryptedStorageKeyList.USERINFO,
      JSON.stringify(parsedData),
    );

    setFlag(() => ({
      home: {
        update: {
          application: true,
          invitation: true,
          myteam: true,
        },
      },
    }));
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Team'}],
      }),
    );
    setUserInfo(prev => ({team: null, user: prev.user}));
  };

  const withdrawTeam = useCallback(() => {
    Alert.alert(
      '팀 탈퇴',
      `정말로 팀 ${userInfo?.team?.name} 탈퇴하시겠습니까?`,
      [
        {
          text: '취소',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: '탈퇴',
          onPress: async () => {
            await withdraw({teamId: userInfo?.team?.id as number});
            resetTeam();
            Alert.alert('탈퇴되었습니다.');
          },
          style: 'destructive',
        },
      ],
    );
  }, []);

  const destoryTeam = useCallback(async () => {
    Alert.alert(
      '팀 삭제',
      `정말로 팀 ${userInfo?.team?.name}(을/를) 삭제하시겠습니까?`,
      [
        {
          text: '취소',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: '삭제',
          onPress: async () => {
            await deleteTeam({id: userInfo?.team?.id as number});
            resetTeam();
            Alert.alert('삭제되었습니다.');
          },
          style: 'destructive',
        },
      ],
    );
  }, []);

  const renderItem = ({item}: {item: {text: string; onPress: () => void}}) => (
    <NavItem text={item.text} onPress={item.onPress} />
  );

  return (
    <Layout scrollable={false} isItWhite={false}>
      <GapRowView
        gap={15}
        marginTop={0}
        marginBottom={0}
        paddingHorizontal={0}
        paddingVertical={0}>
        <DetailHeader
          data={userInfo?.team as TeamType}
          type="team"
          ButtonComponent={() => (
            <SmButton
              bkg={colors.prayButtonDeleteBkgColor}
              radius={10}
              onPress={
                userInfo?.team?.bossId === userInfo?.user?.id
                  ? destoryTeam
                  : withdrawTeam
              }>
              <ButtonText
                color={colors.prayButtonDeleteTextColor}
                fontSize={12.5}
                fontWeight={400}>
                {userInfo?.team?.bossId === userInfo?.user?.id
                  ? '팀 삭제하기'
                  : '탈퇴하기'}
              </ButtonText>
            </SmButton>
          )}
        />
        <FlatList
          scrollEnabled={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={() => (
            <View style={{height: 1, backgroundColor: '#F3F3F3'}} />
          )}
          ListFooterComponent={() => (
            <View
              style={{height: 1, backgroundColor: colors.borderTopBottomColor}}
            />
          )}
        />
      </GapRowView>
    </Layout>
  );
}

export default Detail;
