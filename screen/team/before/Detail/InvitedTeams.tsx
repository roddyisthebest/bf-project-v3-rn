import {FlatList, ActivityIndicator, View, Alert} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {rstMyInfo} from '../../../../recoil/user';
import {LoadingContainer} from '../../../../components/basic/View';
import styled from 'styled-components/native';
import {colors} from '../../../../styles/color';
import ListEmptyComponent from '../../../../components/parts/tabs/ListEmptyComponent';
import TeamInvitationItem from '../../../../components/parts/detail/TeamInvitationItem';
import InvitationType from '../../../../types/InvitationType';
import {getMyInvitations} from '../../../../api/user';
import {deleteInvitation, setApprove} from '../../../../api/team';
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {LoggedInParamList} from '../../../../navigation/Root';
import {updateTeamFlag} from '../../../../recoil/flag';

const ModifiedLoadingContainer = styled(LoadingContainer)`
  justify-content: flex-start;
  padding-top: 20px;
`;

function InvitedTeams() {
  const {team} = useRecoilValue(rstMyInfo);
  const setFlag = useSetRecoilState(updateTeamFlag);

  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const [data, setData] = useState<InvitationType[]>([]);
  const [lastId, setLastId] = useState<number>(-1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  const getData = useCallback(
    async (id: number) => {
      try {
        const {
          data: {payload, code},
        }: {data: {payload: InvitationType[]; code: string}} =
          await getMyInvitations({
            lastId: id,
          });
        if (code === 'OK:LAST') {
          setDisabled(true);
        }
        if (id === -1) {
          setData(payload);
        } else {
          setData(prev => [...prev, ...payload]);
        }
      } catch (e) {
      } finally {
        if (loading) {
          setLoading(false);
        }
      }
    },
    [team],
  );

  const handleRefresh = useCallback(
    async (id: number) => {
      try {
        setDisabled(false);
        setRefreshing(true);
        if (id === -1) {
          const {
            data: {payload, code},
          }: {data: {payload: InvitationType[]; code: string}} =
            await getMyInvitations({
              lastId: id,
            });
          setData(payload);
          if (code === 'OK:LAST') {
            setDisabled(true);
          }
        } else {
          setLastId(-1);
        }
      } catch (e) {
      } finally {
        setRefreshing(false);
      }
    },
    [team],
  );

  const approveInvitation = useCallback((id: number) => {
    Alert.alert('초대 수락', '정말 팀의 초대에 수락하시겠습니까?', [
      {
        text: '취소',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: '수락',
        onPress: async () => {
          try {
            await setApprove({id});
            setFlag(true);
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Team'}],
              }),
            );
            Alert.alert('팀에 성공적으로 가입되었습니다.');
          } catch (e) {
            console.log(e);
          }
        },
        style: 'default',
      },
    ]);
  }, []);

  const deleteInvitaionFromState = useCallback((id: number) => {
    Alert.alert('초대 거절', '정말 팀의 초대를 거절하시겠습니까?', [
      {
        text: '취소',
        onPress: () => {},
        style: 'default',
      },
      {
        text: '거절',
        onPress: async () => {
          try {
            await deleteInvitation({id});
            setData(prev => prev?.filter(pray => pray.id !== id));
            Alert.alert('삭제되었습니다.');
          } catch (e) {
            console.log(e);
          }
        },
        style: 'destructive',
      },
    ]);
  }, []);

  const renderItem = ({item}: {item: InvitationType}) => (
    <TeamInvitationItem
      data={item}
      refuse={deleteInvitaionFromState}
      approve={approveInvitation}
    />
  );

  useEffect(() => {
    if (!disabled) {
      getData(lastId);
    }
  }, [disabled, getData, lastId]);

  return loading ? (
    <ModifiedLoadingContainer>
      <ActivityIndicator color={colors.loadingIconColor} size={25} />
    </ModifiedLoadingContainer>
  ) : (
    <FlatList
      data={data}
      refreshing={refreshing}
      onRefresh={() => handleRefresh(lastId)}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      onEndReached={() => {
        if (data.length !== 0) {
          setLastId(data[data.length - 1].id);
        }
      }}
      ListEmptyComponent={
        <ListEmptyComponent text="가입한 팀이 없습니다." paddingTop={20} />
      }
      ItemSeparatorComponent={() => <View style={{height: 1}} />}
    />
  );
}

export default InvitedTeams;
