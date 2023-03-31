import React, {useRef} from 'react';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import {ActionSheetIOS, Platform} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {Item} from '../../basic/List';
import {ButtonText} from '../../basic/Button';
import {colors} from '../../../styles/color';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../recoil/user';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../../navigation/Root';

const Container = styled.Pressable<{borderColor: string}>`
  width: 25px;
  height: 25px;
  border-radius: 5px;
  border-color: ${props => props.borderColor};
  border-width: 1px;
`;
const Image = styled(FastImage)`
  width: 100%;
  height: 100%;
  border-radius: 5px;
`;

function MyTeamInfo() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const myInfo = useRecoilValue(rstMyInfo);

  const actionSheetRef = useRef<ActionSheetRef>(null);
  const onPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['취소', '팀 정보', '팀원 초대', '팀 이동하기'],
          destructiveButtonIndex: 3,
          cancelButtonIndex: 0,
          userInterfaceStyle: 'light',
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            navigation.navigate('Team', {screen: 'Detail'});
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
            uri: `http://192.168.123.104:3000/${myInfo.team?.img}`,
          }}
        />
      </Container>
      <ActionSheet ref={actionSheetRef} gestureEnabled={true}>
        <Item
          borderColor={colors.bottomSheetItemBorderColor}
          onPress={() => {
            navigation.navigate('Team', {screen: 'Detail'});
          }}>
          <ButtonText
            color={colors.positiveColor}
            fontSize={15}
            fontWeight={500}>
            팀 정보
          </ButtonText>
        </Item>
        <Item borderColor={colors.bottomSheetItemBorderColor}>
          <ButtonText
            color={colors.positiveColor}
            fontSize={15}
            fontWeight={500}>
            팀원 초대
          </ButtonText>
        </Item>
        <Item borderColor={colors.bottomSheetItemBorderColor}>
          <ButtonText
            color={colors.negativeColor}
            fontSize={15}
            fontWeight={500}>
            팀 이동하기
          </ButtonText>
        </Item>
      </ActionSheet>
    </>
  );
}

export default MyTeamInfo;
