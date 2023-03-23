import {Platform, View} from 'react-native';
import React, {useCallback, useState, useRef} from 'react';
import Pray from '../../components/card/Pray';
import UserType from '../../types/UserType';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import DateHeader from '../../components/parts/tabs/DateHeader';
import DatePickerModal from '../../components/modal/DatePickerModal';

import {thisSunday} from '../../util/Date';
import {ActionSheetRef} from 'react-native-actions-sheet';

function PrayView() {
  const date = new Date();

  const [data, setData] = useState<UserType[]>([
    {
      id: 1,
      img: 'https://cdn.mhns.co.kr/news/photo/202208/532975_645654_1918.jpg',
      name: '안농',
      oauth: 'apple',
      password: null,
      phoneToken: 'bvbdfgsdfg',
      uid: '123123sdfsdffd',
      Prays: [
        {
          id: 1,
          content: '뭐뭐할수있도롥',
          weekend: 'asdasd',
          edit: false,
          editLoading: false,
          deleteLoading: false,
        },
      ],
      updatedAt: date,
      createdAt: date,
      deletedAt: date,
    },
    {
      id: 2,
      img: 'https://cdn.mhns.co.kr/news/photo/202208/532975_645654_1918.jpg',
      name: '안농',
      oauth: 'apple',
      password: null,
      phoneToken: 'bvbdfgsdfg',
      uid: '123123sdfsdffd',
      Prays: [
        {
          id: 3,
          content: '뭐뭐할수있도롥',
          weekend: 'asdasd',
          edit: false,
          editLoading: false,
          deleteLoading: false,
        },
        {
          id: 4,
          content: '뭐뭐할수있도롥',
          weekend: 'asdasd',
          edit: false,
          editLoading: false,
          deleteLoading: false,
        },
      ],
      updatedAt: date,
      createdAt: date,
      deletedAt: date,
    },
    {
      id: 3,
      img: 'https://cdn.mhns.co.kr/news/photo/202208/532975_645654_1918.jpg',
      name: '안농',
      oauth: 'apple',
      password: null,
      phoneToken: 'bvbdfgsdfg',
      uid: '123123sdfsdffd',
      Prays: [
        {
          id: 3,
          content: '뭐뭐할수있도롥',
          weekend: 'asdasd',
          edit: false,
          editLoading: false,
          deleteLoading: false,
        },
        {
          id: 4,
          content: '뭐뭐할수있도롥',
          weekend: 'asdasd',
          edit: false,
          editLoading: false,
          deleteLoading: false,
        },
      ],
      updatedAt: date,
      createdAt: date,
      deletedAt: date,
    },
    {
      id: 4,
      img: 'https://cdn.mhns.co.kr/news/photo/202208/532975_645654_1918.jpg',
      name: '안농',
      oauth: 'apple',
      password: null,
      phoneToken: 'bvbdfgsdfg',
      uid: '123123sdfsdffd',
      Prays: [
        {
          id: 3,
          content: '뭐뭐할수있도롥',
          weekend: 'asdasd',
          edit: false,
          editLoading: false,
          deleteLoading: false,
        },
        {
          id: 4,
          content: '뭐뭐할수있도롥',
          weekend: 'asdasd',
          edit: false,
          editLoading: false,
          deleteLoading: false,
        },
      ],
      updatedAt: date,
      createdAt: date,
      deletedAt: date,
    },
    {
      id: 5,
      img: 'https://cdn.mhns.co.kr/news/photo/202208/532975_645654_1918.jpg',
      name: '안농',
      oauth: 'apple',
      password: null,
      phoneToken: 'bvbdfgsdfg',
      uid: '123123sdfsdffd',
      Prays: [
        {
          id: 3,
          content: '뭐뭐할수있도롥',
          weekend: 'asdasd',
          edit: false,
          editLoading: false,
          deleteLoading: false,
        },
        {
          id: 4,
          content: '뭐뭐할수있도롥',
          weekend: 'asdasd',
          edit: false,
          editLoading: false,
          deleteLoading: false,
        },
      ],
      updatedAt: date,
      createdAt: date,
      deletedAt: date,
    },
  ]);

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [weekend, setWeekend] = useState<string>(thisSunday(0));

  const handleRefresh = useCallback(async () => {}, []);
  const renderItem = ({item}: {item: UserType}) => <Pray />;
  const ref = useRef<ActionSheetRef>(null);

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
