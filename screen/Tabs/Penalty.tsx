import {FlatList, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Penalty from '../../components/card/Penalty';
import UserType from '../../types/UserType';
import ListEmptyComponent from '../../components/parts/tabs/ListEmptyComponent';
import {getPenaltys} from '../../api/penalty';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../recoil/user';

function PenaltyView() {
  const {team} = useRecoilValue(rstMyInfo);

  const [data, setData] = useState<UserType[]>([]);
  const [lastId, setLastId] = useState<number>(-1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);

  const handleRefresh = useCallback(
    async (id: number) => {
      try {
        setDisabled(false);
        setRefreshing(true);
        if (id === -1) {
          const {
            data: {payload, code},
          }: {data: {payload: UserType[]; code: string}} = await getPenaltys(
            id,
            team?.id as number,
          );
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
  const renderItem = ({item}: {item: UserType}) => <Penalty data={item} />;

  const getData = useCallback(
    async (id: number) => {
      try {
        const {
          data: {payload, code},
        }: {data: {payload: UserType[]; code: string}} = await getPenaltys(
          id,
          team?.id as number,
        );

        if (code === 'last data') {
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

  useEffect(() => {
    if (!disabled) {
      getData(lastId);
    }
  }, [disabled, getData, lastId]);
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      refreshing={refreshing}
      keyExtractor={(item, _) => item.id.toString()}
      onRefresh={() => {
        handleRefresh(lastId);
      }}
      onEndReached={() => {
        if (data.length !== 0) {
          setLastId(data[data.length - 1].id);
        }
      }}
      ItemSeparatorComponent={() => <View style={{height: 15}} />}
      ListEmptyComponent={
        <ListEmptyComponent text="기도제목이 없습니다." paddingTop={15} />
      }
      ListFooterComponent={() => <View style={{height: 160}} />}
    />
  );
}

export default PenaltyView;
