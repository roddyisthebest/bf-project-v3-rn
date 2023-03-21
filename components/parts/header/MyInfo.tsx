import React, {useRef} from 'react';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import {colors} from '../../../styles/color';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../recoil/user';
import {Text, ActionSheetIOS, Platform} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {Item} from '../../basic/List';
import {ButtonText} from '../../basic/Button';
const Container = styled.Pressable<{borderColor: string}>`
  width: 25px;
  height: 25px;
  border-radius: 25px;
  border-color: ${props => props.borderColor};
  border-width: 1px;
`;
const Image = styled(FastImage)`
  width: 100%;
  height: 100%;
  border-radius: 30px;
`;

function MyInfo() {
  const myInfo = useRecoilValue(rstMyInfo);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const onPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['취소', '내 정보', '로그아웃'],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
          userInterfaceStyle: 'light',
        },
        buttonIndex => {
          console.log(buttonIndex);
        },
      );
    } else {
      actionSheetRef.current?.show();
    }
  };
  return (
    <>
      <Container borderColor={colors.buttonBorderColor} onPress={onPress}>
        <Image
          source={{
            uri: myInfo.user?.img,
          }}
        />
      </Container>
      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled={true}
        containerStyle={{
          paddingBottom: 25,
        }}>
        <Item borerColor={colors.bottomSheetItemBorderColor}>
          <ButtonText color={colors.positiveColor} fontSize={15}>
            내 정보
          </ButtonText>
        </Item>
        <Item borerColor={colors.bottomSheetItemBorderColor}>
          <ButtonText color={colors.negativeColor} fontSize={15}>
            로그아웃
          </ButtonText>
        </Item>
      </ActionSheet>
    </>
  );
}

export default MyInfo;
