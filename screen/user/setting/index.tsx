import {FlatList, View, Alert, ActivityIndicator} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import Layout from '../../../components/layout';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../../navigation/Root';

import {colors} from '../../../styles/color';

import NavItem from '../../../components/parts/detail/NavItem';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import {rstMyInfo} from '../../../recoil/user';
import styled from 'styled-components/native';
import {ButtonText} from '../../../components/basic/Button';
import dimension from '../../../styles/dimension';
import {withdraw} from '../../../api/user';
import {rstAuth} from '../../../recoil/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
const WithdrawButton = styled.Pressable`
  height: 50px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-top-width: 1px;
  border-color: #f3f3f3;
`;

const WithdrawButtonText = styled(ButtonText)``;
function Setting() {
  const {team} = useRecoilValue(rstMyInfo);

  const resetRstMyInfo = useResetRecoilState(rstMyInfo);
  const resetRstAuth = useResetRecoilState(rstAuth);
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState([
    {
      id: 1,
      text: '사용기능 수정',
      onPress: () => {
        navigation.navigate('User', {screen: 'Service'});
      },
    },
  ]);

  const alert = useCallback(() => {
    return Alert.alert(
      '회원 탈퇴',
      '정말 계정을 영구적으로 삭제하시겠습니까?',
      [
        {
          onPress: async () => {
            await withdraw();
            resetRstAuth();
            resetRstMyInfo();
            await EncryptedStorage.clear();
            Alert.alert(
              '계정삭제',
              '성공적으로 계정이 영구적으로 삭제되었습니다.',
            );
          },
          text: '예',
          style: 'cancel',
        },
        {
          onPress: () => {},
          text: '아니오',
          style: 'destructive',
        },
      ],
    );
  }, []);

  useEffect(() => {
    if (team === null) {
      setData(data.filter(d => d.id !== 1));
    }
  }, [team]);

  const renderItem = ({item}: {item: {text: string; onPress: () => void}}) => (
    <NavItem text={item.text} onPress={item.onPress} />
  );

  return (
    <Layout scrollable={false} isItWhite={false}>
      <FlatList
        scrollEnabled={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={() => (
          <View style={{height: 1, backgroundColor: '#F3F3F3'}} />
        )}
        ListFooterComponent={() => (
          <>
            <WithdrawButton
              onPress={alert}
              style={{paddingHorizontal: dimension.paddingHorizontal}}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color={colors.loadingIconColor} />
              ) : (
                <WithdrawButtonText color="red" fontSize={18} fontWeight={500}>
                  회원 탈퇴
                </WithdrawButtonText>
              )}
            </WithdrawButton>
            <View
              style={{height: 1, backgroundColor: colors.borderTopBottomColor}}
            />
          </>
        )}
      />
    </Layout>
  );
}

export default Setting;
