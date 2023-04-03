import React, {useRef} from 'react';
import {colors} from '../../../styles/color';
import {ActionSheetIOS, Platform} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {Item} from '../../basic/List';
import {ButtonText} from '../../basic/Button';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../../navigation/Root';
import {SmButton} from '../../basic/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';

const ModifiedButton = styled(SmButton)`
  padding: 0;
`;

function MyTeamMenu() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const actionSheetRef = useRef<ActionSheetRef>(null);

  const goToTeamCreating = () => {
    navigation.navigate('Team', {screen: 'Creating'});
  };
  const goToTeamSearching = () => {
    navigation.navigate('Team', {screen: 'Searching'});
  };
  const onPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['취소', '팀 생성', '팀 검색'],
          cancelButtonIndex: 0,
          userInterfaceStyle: 'light',
        },
        async buttonIndex => {
          if (buttonIndex === 1) {
            goToTeamCreating();
          } else if (buttonIndex === 2) {
            goToTeamSearching();
          }
        },
      );
    } else {
      actionSheetRef.current?.show();
    }
  };
  return (
    <>
      <ModifiedButton bkg="transparent" radius={0} onPress={onPress}>
        <Icon
          name="menu-sharp"
          color={colors.cardBorderBottomColor}
          size={25}
        />
      </ModifiedButton>
      <ActionSheet ref={actionSheetRef} gestureEnabled={true}>
        <Item
          borderColor={colors.bottomSheetItemBorderColor}
          onPress={goToTeamCreating}>
          <ButtonText
            color={colors.positiveColor}
            fontSize={15}
            fontWeight={500}>
            팀 생성
          </ButtonText>
        </Item>
        <Item
          borderColor={colors.bottomSheetItemBorderColor}
          onPress={goToTeamSearching}>
          <ButtonText
            color={colors.positiveColor}
            fontSize={15}
            fontWeight={500}>
            팀 검색
          </ButtonText>
        </Item>
      </ActionSheet>
    </>
  );
}

export default MyTeamMenu;
