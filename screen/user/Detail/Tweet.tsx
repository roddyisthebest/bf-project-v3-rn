import {View, FlatList, ActivityIndicator, Alert} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import TweetPropType from '../../../types/TweetPropType';
import Tweet from '../../../components/card/Tweet';
import {deleteTweet} from '../../../api/tweet';
import {getMyTweets} from '../../../api/user';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../recoil/user';
import {LoadingContainer} from '../../../components/basic/View';
import {colors} from '../../../styles/color';
import ListEmptyComponent from '../../../components/parts/tabs/ListEmptyComponent';
import {AxiosError} from 'axios';
import {response as responseType} from '../../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncStorageKeyList} from '../../../navigation/Root';
import ReportModal from '../../../components/modal/ReportModal';
import {ActionSheetRef} from 'react-native-actions-sheet';

function Home() {
  const ref = useRef<FlatList>(null);
  const reportRef = useRef<ActionSheetRef>(null);

  const userInfo = useRecoilValue(rstMyInfo);

  const [data, setData] = useState<TweetPropType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastId, setLastId] = useState<number>(-1);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [model, setModel] = useState<string>('');

  const onRefresh = useCallback(async () => {
    try {
      setDisabled(false);
      setRefreshing(true);
      if (lastId === -1) {
        const {
          data: {payload},
        }: {data: {payload: TweetPropType[]}} = await getMyTweets({
          lastId: lastId,
          teamId: userInfo.team?.id as number,
        });

        let payloadVariable = payload;

        const reportListStr = await AsyncStorage.getItem(
          AsyncStorageKeyList.REPORT_TWEET_LIST,
        );

        if (reportListStr !== null) {
          const reportList: number[] = JSON.parse(reportListStr);
          console.log(reportList);
          payloadVariable = payloadVariable.filter(
            p => !reportList.includes(p.id),
          );
        }
        setData(payloadVariable);
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
        }: {data: {payload: TweetPropType[]; code: string}} = await getMyTweets(
          {
            lastId: lastId,
            teamId: userInfo.team?.id as number,
          },
        );

        let payloadVariable = payload;

        const reportListStr = await AsyncStorage.getItem(
          AsyncStorageKeyList.REPORT_TWEET_LIST,
        );

        if (reportListStr !== null) {
          const reportList: number[] = JSON.parse(reportListStr);
          console.log(reportList);
          payloadVariable = payloadVariable.filter(
            p => !reportList.includes(p.id),
          );
        }

        if (code === 'OK:LAST') {
          setDisabled(true);
        }
        if (id === -1) {
          setData(payloadVariable);
        } else {
          setData(prev => [...prev, ...payloadVariable]);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    },
    [userInfo, lastId],
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
            try {
              data.splice(index, 1, {...data[index], loading: true});
              setData([...data]);
              await deleteTweet(id);
            } catch (error) {
              const {response} = error as unknown as AxiosError<responseType>;
              if (response?.status === 404) {
                return setData(tweet => tweet.filter(e => e.id !== id));
              }
            }
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
  const showReport = useCallback((id: number, index: number) => {
    reportRef.current?.show();

    console.log({id, index, type: 'tweet'});
    let modelStr = JSON.stringify({id, index, type: 'tweet'});
    setModel(modelStr);
  }, []);

  useEffect(() => {
    if (!disabled) {
      getData(lastId);
    }
  }, [getData, lastId, disabled]);

  const renderItem = ({item, index}: {item: TweetPropType; index: number}) => (
    <Tweet
      data={item}
      deleteFuc={delTweet}
      reportFuc={showReport}
      index={index}
    />
  );
  return loading ? (
    <LoadingContainer>
      <ActivityIndicator color={colors.loadingIconColor} size={50} />
    </LoadingContainer>
  ) : (
    <>
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
      <ReportModal
        ref={reportRef}
        setModel={setModel}
        setData={setData}
        model={model}
      />
    </>
  );
}

export default Home;
