import {FlatList, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import PenaltyType from '../../types/PenaltyType';
import Penalty from '../../components/card/Penalty';
import UserType from '../../types/UserType';

function PenaltyView() {
  const date = new Date();
  const user: UserType = {
    id: 1,
    img: 'https://cdn.mhns.co.kr/news/photo/202208/532975_645654_1918.jpg',
    name: '안농',
    oauth: 'apple',
    password: null,
    phoneToken: 'bvbdfgsdfg',
    uid: '123123sdfsdffd',
    Prays: null,
    updatedAt: date,
    createdAt: date,
    deletedAt: date,
  };
  const [data, setData] = useState<PenaltyType[]>([
    {id: 0, weekend: '2022-02-02', paper: 5000, payed: false, User: user},
    {id: 1, weekend: '2022-02-02', paper: 5000, payed: false, User: user},
    {id: 2, weekend: '2022-02-02', paper: 5000, payed: false, User: user},
  ]);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleRefresh = useCallback(async () => {}, []);
  const renderItem = ({item}: {item: PenaltyType}) => <Penalty data={item} />;

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      refreshing={refreshing}
      keyExtractor={(item, _) => item.id.toString()}
      ItemSeparatorComponent={() => <View style={{height: 15}} />}
      ListFooterComponent={() => <View style={{height: 160}} />}
    />
  );
}

export default PenaltyView;
