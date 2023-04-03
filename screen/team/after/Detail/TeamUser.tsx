import {ActivityIndicator, FlatList} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import UserType from '../../../../types/UserType';
import UserTeamItem from '../../../../components/parts/detail/UserTeamItem';
import {getTeamMates} from '../../../../api/team';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../../recoil/user';
import {colors} from '../../../../styles/color';
import ListEmptyComponent from '../../../../components/parts/tabs/ListEmptyComponent';
import {LoadingContainer} from '../../../../components/basic/View';
import styled from 'styled-components/native';

const ModifiedLoadingContainer = styled(LoadingContainer)`
  justify-content: flex-start;
  padding-top: 20px;
`;

function TeamUser() {
  const date = new Date();

  const {team} = useRecoilValue(rstMyInfo);

  const [lastId, setLastId] = useState<number>(-1);
  const [data, setData] = useState<UserType[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);

  const getData = useCallback(
    async (id: number) => {
      try {
        const {
          data: {payload, code},
        }: {data: {payload: UserType[]; code: string}} = await getTeamMates({
          lastId: id,
          teamId: team?.id as number,
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
        console.log(e);
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
          }: {data: {payload: UserType[]; code: string}} = await getTeamMates({
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

  useEffect(() => {
    if (!disabled) {
      getData(lastId);
    }
  }, [disabled, getData, lastId]);

  const renderItem = ({item}: {item: UserType}) => <UserTeamItem data={item} />;
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
