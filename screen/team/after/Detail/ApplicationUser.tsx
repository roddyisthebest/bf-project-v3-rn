import {FlatList, ActivityIndicator, Alert} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import InvitationType from '../../../../types/InvitationType';
import {deleteInvitation, getApplications} from '../../../../api/team';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../../recoil/user';
import {LoadingContainer} from '../../../../components/basic/View';
import styled from 'styled-components/native';
import {colors} from '../../../../styles/color';
import ListEmptyComponent from '../../../../components/parts/tabs/ListEmptyComponent';
import UserApplyItem from '../../../../components/parts/detail/UserApplyItem';
import {setApproveApplication} from '../../../../api/team';
const ModifiedLoadingContainer = styled(LoadingContainer)`
  justify-content: flex-start;
  padding-top: 20px;
`;

function ApplicationUser() {
  const {team} = useRecoilValue(rstMyInfo);

  const [data, setData] = useState<InvitationType[]>([]);
  const [lastId, setLastId] = useState<number>(-1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);

  const getData = useCallback(
    async (id: number) => {
      try {
        const {
          data: {payload, code},
        }: {data: {payload: InvitationType[]; code: string}} =
          await getApplications({
            teamId: team?.id as number,
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
            await getApplications({
              teamId: team?.id as number,
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

  const approveApplicationFromState = useCallback(
    (id: number) => {
      Alert.alert('가입 신청 수락', '정말 가입 신청을 수락할까요?', [
        {
          text: '취소',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: '수락',
          onPress: async () => {
            try {
              await setApproveApplication({id, teamId: team?.id as number});
              setData(prev => prev?.filter(pray => pray.id !== id));
              Alert.alert('가입 신청을 수락하였습니다.');
            } catch (e) {
              console.log(e);
            }
          },
          style: 'default',
        },
      ]);
    },
    [team],
  );

  const deleteApplicationFromState = useCallback(
    async (id: number) => {
      Alert.alert('가입 신청 거절', '정말 가입 신청을 거절할까요?', [
        {
          text: '취소',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: '거절',
          onPress: async () => {
            try {
              await deleteInvitation({id, teamId: team?.id as number});
              setData(prev => prev?.filter(pray => pray.id !== id));
              Alert.alert('가입 신청이 거절 되었습니다.');
            } catch (e) {
              console.log(e);
            }
          },
          style: 'destructive',
        },
      ]);
    },
    [data, team],
  );

  const renderItem = ({item}: {item: InvitationType}) => (
    <UserApplyItem
      data={item}
      approve={approveApplicationFromState}
      refuse={deleteApplicationFromState}
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
      renderItem={renderItem}
      refreshing={refreshing}
      keyExtractor={item => item.id.toString()}
      onRefresh={() => handleRefresh(lastId)}
      onEndReached={() => {
        if (data.length !== 0) {
          setLastId(data[data.length - 1].id);
        }
      }}
      ListEmptyComponent={
        <ListEmptyComponent
          text="가입 신청한 유저들이 없습니다."
          paddingTop={20}
        />
      }
    />
  );
}

export default ApplicationUser;
