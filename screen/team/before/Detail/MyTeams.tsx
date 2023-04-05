import {FlatList, ActivityIndicator, View} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../../recoil/user';
import {LoadingContainer} from '../../../../components/basic/View';
import styled from 'styled-components/native';
import {colors} from '../../../../styles/color';
import ListEmptyComponent from '../../../../components/parts/tabs/ListEmptyComponent';
import TeamType from '../../../../types/TeamType';
import TeamItem from '../../../../components/parts/detail/TeamItem';
import {getMyTeams} from '../../../../api/user';

const ModifiedLoadingContainer = styled(LoadingContainer)`
  justify-content: flex-start;
  padding-top: 20px;
`;

function MyTeams() {
  const {team} = useRecoilValue(rstMyInfo);

  const [data, setData] = useState<TeamType[]>([]);
  const [lastId, setLastId] = useState<number>(-1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);

  const getData = useCallback(
    async (id: number) => {
      try {
        const {
          data: {payload, code},
        }: {data: {payload: TeamType[]; code: string}} = await getMyTeams({
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
          }: {data: {payload: TeamType[]; code: string}} = await getMyTeams({
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

  const renderItem = ({item}: {item: TeamType}) => <TeamItem data={item} />;

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
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      onEndReached={() => {
        if (data.length !== 0) {
          setLastId(data[data.length - 1].id);
        }
      }}
      onRefresh={() => handleRefresh(lastId)}
      ListEmptyComponent={
        <ListEmptyComponent text="가입한 팀이 없습니다." paddingTop={20} />
      }
      ItemSeparatorComponent={() => <View style={{height: 1}} />}
    />
  );
}

export default MyTeams;
