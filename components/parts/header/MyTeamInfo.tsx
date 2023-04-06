import React, {useCallback, useRef} from 'react';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import {ActionSheetIOS, Platform} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {Item} from '../../basic/List';
import {ButtonText} from '../../basic/Button';
import {colors} from '../../../styles/color';
import {useRecoilState, useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../recoil/user';
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {
  EncryptedStorageKeyList,
  LoggedInParamList,
} from '../../../navigation/Root';
import EncryptedStorage from 'react-native-encrypted-storage';

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

  const [myInfo, setMyInfo] = useRecoilState(rstMyInfo);

  const actionSheetRef = useRef<ActionSheetRef>(null);

  const goToDetail = useCallback(
    () => navigation.navigate('Team', {screen: 'Detail'}),
    [navigation],
  );

  const goToUserSetting = useCallback(
    () => navigation.navigate('Team', {screen: 'UserSetting'}),
    [navigation],
  );

  const teamReset = useCallback(async () => {
    await EncryptedStorage.setItem(
      EncryptedStorageKeyList.USERINFO,
      JSON.stringify({user: myInfo.user, team: null}),
    );
    setMyInfo(prev => ({user: prev.user, team: null}));
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Team', params: {screen: 'Home'}}],
      }),
    );
  }, [navigation, setMyInfo]);

  const onPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['취소', '팀 정보', '팀원 초대', '팀 이동하기'],
          destructiveButtonIndex: 3,
          cancelButtonIndex: 0,
          userInterfaceStyle: 'light',
        },
        async buttonIndex => {
          if (buttonIndex === 1) {
            goToDetail();
          } else if (buttonIndex === 2) {
            goToUserSetting();
          } else if (buttonIndex === 3) {
            teamReset();
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
          onPress={goToDetail}>
          <ButtonText
            color={colors.positiveColor}
            fontSize={15}
            fontWeight={500}>
            팀 정보
          </ButtonText>
        </Item>
        <Item
          borderColor={colors.bottomSheetItemBorderColor}
          onPress={goToUserSetting}>
          <ButtonText
            color={colors.positiveColor}
            fontSize={15}
            fontWeight={500}>
            팀원 초대
          </ButtonText>
        </Item>
        <Item
          borderColor={colors.bottomSheetItemBorderColor}
          onPress={teamReset}>
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
