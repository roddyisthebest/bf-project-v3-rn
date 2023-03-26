import {View, FlatList, Text, ActivityIndicator, Alert} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {TweetType} from '../../types/TweetType';
import Tweet from '../../components/card/Tweet';
import {deleteTweet, getTweets} from '../../api/tweet';
import {useRecoilValue, useRecoilState} from 'recoil';
import {rstMyInfo} from '../../recoil/user';
import {addTweetFlag} from '../../recoil/flag';
import {LoadingContainer} from '../../components/basic/View';
import {colors} from '../../styles/color';
import ListEmptyComponent from '../../components/parts/tabs/ListEmptyComponent';
function Home() {
  const ref = useRef<FlatList>(null);

  const userInfo = useRecoilValue(rstMyInfo);
  const [flag, setFlag] = useRecoilState(addTweetFlag);

  const [data, setData] = useState<TweetType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
        }: {data: {payload: TweetType[]}} = await getTweets(
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
        }: {data: {payload: TweetType[]; code: string}} = await getTweets(
          id,
          userInfo.team?.id as number,
        );
        payload.map(p => {
          console.log(p.id);
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
    [userInfo],
  );

  const showConfirmDialog = useCallback(
    (id: number) => {
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
            try {
              await deleteTweet(id);
              setData(tweet => tweet.filter(e => e.id !== id));
              onRefresh();
            } catch (e) {}
          },
          style: 'destructive',
        },
      ]);
    },
    [onRefresh],
  );
  const delTweet = useCallback(
    async (id: number) => {
      showConfirmDialog(id);
    },
    [showConfirmDialog],
  );

  useEffect(() => {
    if (!disabled) {
      getData(lastId);
    }
  }, [getData, lastId, disabled]);

  useEffect(() => {
    if (flag) {
      onRefresh();
      ref.current?.scrollToOffset({animated: true, offset: 0});
      setFlag(false);
    }
  }, [flag, onRefresh, setFlag]);

  const renderItem = ({item}: {item: TweetType}) => (
    <Tweet data={item} deleteFuc={delTweet} />
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
      ListEmptyComponent={<ListEmptyComponent text="게시글이 없습니다." />}
    />
  );
}

export default Home;
