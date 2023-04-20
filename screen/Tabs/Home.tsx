import {View, FlatList, ActivityIndicator, Alert} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import TweetPropType from '../../types/TweetPropType';
import Tweet from '../../components/card/Tweet';
import {deleteTweet, getTweets} from '../../api/tweet';
import {useRecoilValue, useRecoilState} from 'recoil';
import {rstMyInfo} from '../../recoil/user';
import {rstNotificationFlag, rstTweetFlag} from '../../recoil/flag';
import {LoadingContainer} from '../../components/basic/View';
import {colors} from '../../styles/color';
import ListEmptyComponent from '../../components/parts/tabs/ListEmptyComponent';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../navigation/Root';
function Home() {
  const ref = useRef<FlatList>(null);
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const userInfo = useRecoilValue(rstMyInfo);
  const [flag, setFlag] = useRecoilState(rstTweetFlag);
  const [rstNotificationState, setRstNotificationState] =
    useRecoilState(rstNotificationFlag);

  const [data, setData] = useState<TweetPropType[]>([]);
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
        }: {data: {payload: TweetPropType[]}} = await getTweets(
          lastId,
          userInfo.team?.id as number,
        );
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
        }: {data: {payload: TweetPropType[]; code: string}} = await getTweets(
          id,
          userInfo.team?.id as number,
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
        setLoading(false);
      }
    },
    [userInfo],
  );

  const showConfirmDialog = useCallback(
    (id: number, index: number) => {
      return Alert.alert('게시글 삭제', '정말로 이 게시글을 삭제할까요?', [
        // The "Yes" button
        {
          text: '취소',
          onPress: () => {},
          style: 'cancel',
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: '삭제',
          onPress: async () => {
            data.splice(index, 1, {...data[index], loading: true});
            setData([...data]);
            await deleteTweet(id);
            data.splice(index, 1, {...data[index], loading: false});
            setData([...data]);

            setData(tweet => tweet.filter(e => e.id !== id));
            onRefresh();
          },
          style: 'destructive',
        },
      ]);
    },
    [onRefresh, data],
  );
  const delTweet = useCallback(
    async (id: number, index: number) => {
      showConfirmDialog(id, index);
    },
    [showConfirmDialog],
  );

  useEffect(() => {
    if (!disabled) {
      getData(lastId);
    }
  }, [getData, lastId, disabled]);

  useEffect(() => {
    if (flag.upload) {
      onRefresh();
      ref.current?.scrollToOffset({animated: true, offset: 0});
      setFlag({upload: false});
      console.log('home 업로드 플래그!');
    }
  }, [flag.upload, onRefresh, setFlag]);

  useEffect(() => {
    console.log(rstNotificationState, 'home');

    if (rstNotificationState === 'penalty:set') {
      navigation.navigate('Tabs', {screen: 'Penalty'});
      setRstNotificationState(null);
    }
  }, [rstNotificationState, navigation]);
  const renderItem = ({item, index}: {item: TweetPropType; index: number}) => (
    <Tweet data={item} deleteFuc={delTweet} index={index} />
  );
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
      ref={ref}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      removeClippedSubviews={true}
      ListEmptyComponent={
        <ListEmptyComponent text="게시글이 없습니다." paddingTop={15} />
      }
    />
  );
}

export default Home;
