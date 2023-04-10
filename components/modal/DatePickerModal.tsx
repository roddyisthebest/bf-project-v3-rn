import React, {
  forwardRef,
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
  useRef,
} from 'react';
import {FlatList, View} from 'react-native';
import {Item} from '../basic/List';
import {colors} from '../../styles/color';
import {thisSunday} from '../../util/Date';
import dimension from '../../styles/dimension';
import styled from 'styled-components/native';
import {ButtonText} from '../basic/Button';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {useSetRecoilState} from 'recoil';
import {rstStore} from '../../recoil/store';
const ClickedText = styled(ButtonText)``;
const UnclickedText = styled(ButtonText)``;

interface Props {
  setWeekend: Dispatch<SetStateAction<string>>;
  setLastId: Dispatch<SetStateAction<number>>;
  setDisabled: Dispatch<SetStateAction<boolean>>;
  weekend: string;
}

const DatePickerModal = forwardRef(
  (props: Props, ref: React.ForwardedRef<ActionSheetRef>) => {
    const setRstWeekend = useSetRecoilState(rstStore);

    const [data, setData] = useState<{id: number; content: string}[]>([]);
    const [day, setDay] = useState<number>(0);
    const [scrollPosition, setScrollPosition] = useState<number>(0);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
      const arr: {id: number; content: string}[] = [];
      for (let i = day; i > day - 500; i--) {
        arr.push({id: i, content: thisSunday(i * 7)});
      }
      setData(prev => [...prev, ...arr]);
    }, [day, setData]);

    useEffect(() => {
      setDay(0);
    }, []);

    const onPress = (content: string, id: number) => {
      props.setLastId(-1);
      props.setDisabled(false);
      props.setWeekend(content);
      setRstWeekend(prev => ({...prev, weekend: content}));
      (ref as React.ForwardedRef<ActionSheetRef>)?.current.hide();
      setScrollPosition(id * -1 * 50);
    };

    const renderItem = ({item}: {item: {id: number; content: string}}) => (
      <Item
        borderColor={colors.bottomSheetItemBorderColor}
        onPress={() => onPress(item.content, item.id)}>
        {props.weekend === item.content ? (
          <ClickedText color="black" fontSize={15} fontWeight={600}>
            {item.content}
          </ClickedText>
        ) : (
          <UnclickedText color="black" fontSize={15} fontWeight={400}>
            {item.content}
          </UnclickedText>
        )}
      </Item>
    );

    return (
      <ActionSheet
        ref={ref}
        gestureEnabled={false}
        keyboardHandlerEnabled={false}
        onOpen={() => {
          flatListRef.current?.scrollToOffset({
            animated: true,
            offset: scrollPosition,
          });
        }}>
        <View style={{height: dimension.height * 0.5}}>
          <FlatList
            ref={flatListRef}
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            onEndReached={() => {
              setDay(prevDay => prevDay - 500);
            }}
            scrollToOverflowEnabled={true}
          />
        </View>
      </ActionSheet>
    );
  },
);

export default DatePickerModal;
