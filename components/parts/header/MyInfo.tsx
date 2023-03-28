import React, {useRef} from 'react';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import {colors} from '../../../styles/color';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../recoil/user';
import {ActionSheetIOS, Platform} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {Item} from '../../basic/List';
import {ButtonText} from '../../basic/Button';
import EncryptedStorage from 'react-native-encrypted-storage';
import {EncryptedStorageKeyList} from '../../../navigation/Root';
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
        async buttonIndex => {
          if (buttonIndex === 2) {
            await EncryptedStorage.removeItem(
              EncryptedStorageKeyList.ACCESSTOKEN,
            );
            await EncryptedStorage.removeItem(
              EncryptedStorageKeyList.REFRESHTOKEN,
            );
            await EncryptedStorage.removeItem(EncryptedStorageKeyList.USERINFO);
          }
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
      <ActionSheet ref={actionSheetRef} gestureEnabled={true}>
        <Item borderColor={colors.bottomSheetItemBorderColor}>
          <ButtonText
            color={colors.positiveColor}
            fontSize={15}
            fontWeight={500}>
            내 정보
          </ButtonText>
        </Item>
        <Item
          borderColor={colors.bottomSheetItemBorderColor}
          onPress={async () => {
            await EncryptedStorage.removeItem(
              EncryptedStorageKeyList.ACCESSTOKEN,
            );
            await EncryptedStorage.removeItem(
              EncryptedStorageKeyList.REFRESHTOKEN,
            );
            await EncryptedStorage.removeItem(EncryptedStorageKeyList.USERINFO);
          }}>
          <ButtonText
            color={colors.negativeColor}
            fontSize={15}
            fontWeight={500}>
            로그아웃
          </ButtonText>
        </Item>
      </ActionSheet>
    </>
  );
}

export default MyInfo;
