import {View, FlatList, ActivityIndicator} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {getMyPrays} from '../../../api/user';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../recoil/user';
import {LoadingContainer} from '../../../components/basic/View';
import {colors} from '../../../styles/color';
import ListEmptyComponent from '../../../components/parts/tabs/ListEmptyComponent';
import PrayType from '../../../types/PrayType';
import PrayReadonly from '../../../components/card/PrayReadonly';

function Pray() {
  const userInfo = useRecoilValue(rstMyInfo);

  const [data, setData] = useState<PrayType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastId, setLastId] = useState<number>(-1);
  const [disabled, setDisabled] = useState<boolean>(false);

  const onRefresh = useCallback(async () => {
    try {
      setDisabled(false);
      setRefreshing(true);
      if (lastId === -1) {
        const {
          data: {payload},
        }: {data: {payload: PrayType[]}} = await getMyPrays({
          lastId: lastId,
          teamId: userInfo.team?.id as number,
        });
        setData(payload);
        setRefreshing(false);
      } else {
        setLastId(-1);
      }
    } catch (e) {
    } finally {
      setRefreshing(false);
    }
  }, [lastId, userInfo]);

  const onEndReached = useCallback(() => {
    if (data.length !== 0) {
      setLastId(data[data.length - 1].id);
    }
  }, [data]);

  const getData = useCallback(
    async (id: number) => {
      try {
        const {
          data: {payload, code},
        }: {data: {payload: PrayType[]; code: string}} = await getMyPrays({
          lastId: lastId,
          teamId: userInfo.team?.id as number,
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
        setLoading(false);
      }
    },
    [userInfo, lastId],
  );

  useEffect(() => {
    if (!disabled) {
      getData(lastId);
    }
  }, [getData, lastId, disabled]);

  const renderItem = ({item}: {item: PrayType}) => <PrayReadonly data={item} />;
  return loading ? (
    <LoadingContainer>
      <ActivityIndicator color={colors.loadingIconColor} size={50} />
    </LoadingContainer>
  ) : (
    <FlatList
      data={data}
      renderItem={renderItem}
      onRefresh={onRefresh}
      refreshing={refreshing}
      keyExtractor={(item, _) => item.id.toString()}
      ItemSeparatorComponent={() => <View style={{height: 15}} />}
      onEndReached={onEndReached}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      removeClippedSubviews={true}
      ListEmptyComponent={
        <ListEmptyComponent
          text="유저의 기도제목이 없습니다."
          paddingTop={15}
        />
      }
    />
  );
}

export default Pray;
