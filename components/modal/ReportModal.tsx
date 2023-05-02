import React, {
  forwardRef,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';
import {FlatList, Pressable, View, Alert} from 'react-native';
import {Item} from '../basic/List';
import {colors} from '../../styles/color';
import dimension from '../../styles/dimension';
import styled from 'styled-components/native';
import {ButtonText} from '../basic/Button';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import TweetPropType from '../../types/TweetPropType';
import {addReport} from '../../api/report';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncStorageKeyList} from '../../navigation/Root';

const Text = styled(ButtonText)``;

const Header = styled.View<{
  paddingVertical: number;
}>`
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: ${props =>
    ` 5px ${props.paddingVertical}px  10px ${props.paddingVertical}px`};
`;

const HeaderTitleText = styled(ButtonText)``;

interface Props {
  setModel: Dispatch<SetStateAction<string>>;
  setData: Dispatch<SetStateAction<TweetPropType[]>>;
  model: string;
  type: 'tweet' | 'pray';
}

const ReportModal = forwardRef(
  (props: Props, ref: React.ForwardedRef<ActionSheetRef>) => {
    const [data, setData] = useState<{id: number; content: string}[]>([
      {id: 1, content: '마음에 들지 않습니다.'},
      {id: 2, content: '나체 이미지 또는 성적 행위'},
      {id: 3, content: '사기 또는 거짓'},
      {id: 4, content: '폭력 또는 위험한 단체'},
      {id: 5, content: '따돌림 또는 괴롬힘'},
      {id: 6, content: '기타 문제'},
    ]);

    const flatListRef = useRef<FlatList>(null);

    const onPress = async (content: string) => {
      try {
        let model: {type: string; index: number; id: number} = JSON.parse(
          props.model,
        );

        let modelStr = JSON.stringify({type: model.type, id: model.id});

        await addReport(content, modelStr);

        if (props.type === 'tweet') {
          const reportListStr = await AsyncStorage.getItem(
            AsyncStorageKeyList.REPORT_TWEET_LIST,
          );
          if (reportListStr === null) {
            const newReportList: number[] = [model.id];

            await AsyncStorage.setItem(
              AsyncStorageKeyList.REPORT_TWEET_LIST,
              JSON.stringify(newReportList),
            );
          } else {
            const reportList: number[] = JSON.parse(reportListStr);
            reportList.push(model.id);
            await AsyncStorage.setItem(
              AsyncStorageKeyList.REPORT_TWEET_LIST,
              JSON.stringify(reportList),
            );
          }

          props.setData(tweet => tweet.filter(e => e.id !== model.id));
        }

        Alert.alert('신고가 접수되었습니다.');
      } catch (e) {
      } finally {
        (ref as React.ForwardedRef<ActionSheetRef>)?.current.hide();
      }
    };

    const renderItem = ({item}: {item: {id: number; content: string}}) => (
      <Item
        borderColor={colors.bottomSheetItemBorderColor}
        onPress={() => onPress(item.content)}>
        <Text color="black" fontSize={15} fontWeight={600}>
          {item.content}
        </Text>
      </Item>
    );

    return (
      <ActionSheet
        ref={ref}
        gestureEnabled={true}
        onClose={() => props.setModel('')}
        keyboardHandlerEnabled={false}>
        <View style={{height: dimension.height * 0.4}}>
          <Header paddingVertical={dimension.paddingVertical}>
            <HeaderTitleText color="black" fontSize={20} fontWeight={600}>
              신고하기
            </HeaderTitleText>
            <Pressable
              onPress={() => {
                (ref as React.RefObject<ActionSheetRef>).current?.hide();
              }}>
              <Icon name="close-outline" color="black" size={25} />
            </Pressable>
          </Header>

          <FlatList
            ref={flatListRef}
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            scrollToOverflowEnabled={true}
          />
        </View>
      </ActionSheet>
    );
  },
);

export default ReportModal;
