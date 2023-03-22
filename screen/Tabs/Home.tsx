import {View, FlatList} from 'react-native';
import React, {useCallback, useState} from 'react';
import {TweetType} from '../../types/TweetType';
import Tweet from '../../components/card/Tweet';
import UserType from '../../types/UserType';

function Home() {
  const date = new Date();
  const user: UserType = {
    id: 1,
    img: 'https://cdn.mhns.co.kr/news/photo/202208/532975_645654_1918.jpg',
    name: '안농',
    oauth: 'apple',
    password: null,
    phoneToken: 'bvbdfgsdfg',
    uid: '123123sdfsdffd',
    updatedAt: date,
    createdAt: date,
    deletedAt: date,
  };
  const [data, setData] = useState<TweetType[]>([
    {
      id: 1,
      img: 'https://cdn.mhns.co.kr/news/photo/202208/532975_645654_1918.jpg',
      content: '나를 잊지마',
      createdAt: date,
      updatedAt: date,
      User: user,
    },
    {
      id: 2,
      img: 'https://cdn.mhns.co.kr/news/photo/202208/532975_645654_1918.jpg',
      content: '',
      createdAt: date,
      updatedAt: date,
      User: user,
    },
    {
      id: 3,
      img: 'https://cdn.mhns.co.kr/news/photo/202208/532975_645654_1918.jpg',
      content: '나를 잊지마',
      createdAt: date,
      updatedAt: date,
      User: user,
    },
    {
      id: 4,
      img: 'https://cdn.mhns.co.kr/news/photo/202208/532975_645654_1918.jpg',
      content: '나를 잊지마',
      createdAt: date,
      updatedAt: date,
      User: user,
    },
    {
      id: 5,
      img: 'https://cdn.mhns.co.kr/news/photo/202208/532975_645654_1918.jpg',
      content: '나를 잊지마',
      createdAt: date,
      updatedAt: date,
      User: user,
    },
  ]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const handleRefresh = useCallback(async () => {}, []);

  const renderItem = ({item}: {item: TweetType}) => <Tweet data={item} />;
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

export default Home;
