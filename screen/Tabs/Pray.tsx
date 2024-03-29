import {ActivityIndicator, Platform, View} from 'react-native';
import React, {useCallback, useState, useRef, useEffect} from 'react';
import Pray from '../../components/card/Pray';
import UserType from '../../types/UserType';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import DateHeader from '../../components/parts/tabs/DateHeader';
import DatePickerModal from '../../components/modal/DatePickerModal';

import {thisSunday} from '../../util/Date';
import {ActionSheetRef} from 'react-native-actions-sheet';
import ListEmptyComponent from '../../components/parts/tabs/ListEmptyComponent';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../recoil/user';
import {getPrays} from '../../api/pray';
import {colors} from '../../styles/color';
import ReportModal from '../../components/modal/ReportModal';
function PrayView() {
  const {team} = useRecoilValue(rstMyInfo);

  const [data, setData] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [weekend, setWeekend] = useState<string>(thisSunday(0));
  const [lastId, setLastId] = useState<number>(-1);
  const [disabled, setDisabled] = useState<boolean>(false);

  const [model, setModel] = useState<string>('');
  const getData = useCallback(async () => {
    try {
      const {
        data: {payload, code},
      }: {data: {payload: UserType[]; code: string}} = await getPrays(
        lastId,
        team?.id as number,
        weekend,
      );

      if (code === 'OK:LAST') {
        setDisabled(true);
      }
      if (lastId === -1) {
        setData([]);
        setData(payload);
      } else {
        setData(prev => [...prev, ...payload]);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [lastId, team, weekend]);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      if (lastId === -1) {
        const {
          data: {payload},
        }: {data: {payload: UserType[]}} = await getPrays(
          -1,
          team?.id as number,
          weekend,
        );
        setData([]);
        setData(payload);
      } else {
        setDisabled(false);
        setLastId(-1);
      }
    } catch (e) {
    } finally {
      setRefreshing(false);
    }
  }, [team?.id, lastId, weekend, disabled]);
  const onEndReached = useCallback(() => {
    if (data.length !== 0) {
      setLastId(data[data.length - 1].id);
    }
  }, [data]);

  const showReport = useCallback((id: number) => {
    reportRef.current?.show();
    let modelStr = JSON.stringify({id, type: 'tweet'});
    setModel(modelStr);
  }, []);
  const renderItem = ({item}: {item: UserType}) => (
    <Pray data={item} showReport={showReport} />
  );

  const ref = useRef<ActionSheetRef>(null);
  const flatListRef = useRef<KeyboardAwareFlatList>(null);
  const reportRef = useRef<ActionSheetRef>(null);

  useEffect(() => {
    if (!disabled) {
      getData();
    }
  }, [lastId, weekend, disabled]);

  useEffect(() => {
    flatListRef.current?.scrollToPosition(0, 0, true);
    setLoading(true);
  }, [weekend]);

  return (
    <>
      <DateHeader
        weekend={weekend}
        onPress={() => {
          ref.current?.show();
        }}
      />
      {loading ? (
        <View style={{alignItems: 'center'}}>
          <ActivityIndicator color={colors.loadingIconColor} size={50} />
        </View>
      ) : (
        <KeyboardAwareFlatList
          data={data}
          onRefresh={handleRefresh}
          extraScrollHeight={100}
          renderItem={renderItem}
          refreshing={refreshing}
          onEndReached={onEndReached}
          ref={flatListRef}
          keyExtractor={(item, _) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={{height: 15}} />}
          ListFooterComponent={() => (
            <View style={{height: Platform.OS === 'ios' ? 160 : 200}} />
          )}
          ListEmptyComponent={
            <ListEmptyComponent
              text={`${weekend} 기간의 기도제목이 없습니다.`}
              paddingTop={0}
            />
          }
        />
      )}
      <ReportModal
        ref={reportRef}
        setModel={setModel}
        setData={() => {}}
        model={model}
        type="tweet"
      />
      <DatePickerModal
        ref={ref}
        weekend={weekend}
        setWeekend={setWeekend}
        setLastId={setLastId}
        setDisabled={setDisabled}
      />
    </>
  );
}

export default PrayView;
