import {Platform, View} from 'react-native';
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
function PrayView() {
  const {team} = useRecoilValue(rstMyInfo);
  const date = new Date();

  const [data, setData] = useState<UserType[]>([]);

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [weekend, setWeekend] = useState<string>(thisSunday(0));
  const [lastId, setLastId] = useState<number>(-1);

  const getData = useCallback(async () => {
    try {
      const res = await getPrays(lastId, team?.id as number, weekend);
      setData(res.data.payload);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  }, [data, lastId, team?.id, weekend]);

  const handleRefresh = useCallback(async () => {}, []);
  const renderItem = ({item}: {item: UserType}) => <Pray data={item} />;

  const ref = useRef<ActionSheetRef>(null);

  useEffect(() => {
    getData();
  }, [weekend]);

  return (
    <>
      <KeyboardAwareFlatList
        data={data}
        extraScrollHeight={100}
        renderItem={renderItem}
        refreshing={refreshing}
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
        ListHeaderComponent={
          <DateHeader
            weekend={weekend}
            onPress={() => {
              ref.current?.show();
            }}
          />
        }
      />
      <DatePickerModal ref={ref} weekend={weekend} setWeekend={setWeekend} />
    </>
  );
}

export default PrayView;
