import {ActivityIndicator, Alert, FlatList} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import UserItem from '../../../../components/parts/detail/UserItem';
import {dropout, getTeamMates} from '../../../../api/team';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../../recoil/user';
import {colors} from '../../../../styles/color';
import ListEmptyComponent from '../../../../components/parts/tabs/ListEmptyComponent';
import {LoadingContainer} from '../../../../components/basic/View';
import styled from 'styled-components/native';
import {AxiosError} from 'axios';
import {response as responseType} from '../../../../api';
import UserPropType from '../../../../types/UserPropType';
const ModifiedLoadingContainer = styled(LoadingContainer)`
  justify-content: flex-start;
  padding-top: 20px;
`;

function TeamUser() {
  const {team} = useRecoilValue(rstMyInfo);

  const [lastId, setLastId] = useState<number>(-1);
  const [data, setData] = useState<UserPropType[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);

  const getData = useCallback(
    async (id: number) => {
      try {
        const {
          data: {payload, code},
        }: {data: {payload: UserPropType[]; code: string}} = await getTeamMates(
          {
            lastId: id,
            teamId: team?.id as number,
          },
        );
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
          }: {data: {payload: UserPropType[]; code: string}} =
            await getTeamMates({
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

  const deleteUserFromState = useCallback(
    (id: number, index: number) => {
      Alert.alert('회원 강퇴', '정말 강퇴하시겠습니까?', [
        {
          onPress: () => {},
          text: '취소',
          style: 'cancel',
        },
        {
          onPress: async () => {
            try {
              data.splice(index, 1, {...data[index], loading: true});
              setData([...data]);
              await dropout({teamId: team?.id as number, userId: id});
              data.splice(index, 1, {...data[index], loading: false});
              setData([...data]);
              setData(prev => prev.filter(user => user.id !== id));
              Alert.alert('강퇴하였습니다.');
            } catch (error) {
              const {response} = error as unknown as AxiosError<responseType>;
              if (response?.status === 409) {
                setData(prev => prev.filter(user => user.id !== id));
              }
            }
          },
          text: '강퇴',
          style: 'destructive',
        },
      ]);
    },
    [team, data],
  );

  useEffect(() => {
    if (!disabled) {
      getData(lastId);
    }
  }, [disabled, getData, lastId]);

  const renderItem = ({item, index}: {item: UserPropType; index: number}) => (
    <UserItem data={item} onPress={deleteUserFromState} index={index} />
  );
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
      onRefresh={() => {
        handleRefresh(lastId);
      }}
      onEndReached={() => {
        if (data.length !== 0) {
          setLastId(data[data.length - 1].id);
        }
      }}
      ListEmptyComponent={
        <ListEmptyComponent text="가입한 유저들이 없습니다." paddingTop={20} />
      }
    />
  );
}

export default TeamUser;
