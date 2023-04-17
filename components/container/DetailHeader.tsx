import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';

import styled from 'styled-components/native';
import {LoggedInParamList} from '../../navigation/Root';
import {colors} from '../../styles/color';
import dimension from '../../styles/dimension';
import TeamType from '../../types/TeamType';
import UserType from '../../types/UserType';
import {ButtonText} from '../basic/Button';
import {Image} from '../basic/Image';

const Container = styled.View<{borderColor: string; paddingHorizontal: number}>`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.borderColor};
  padding: ${props => `20px ${props.paddingHorizontal}px`};
  flex-direction: row;
  column-gap: 5px;
  background-color: white;
`;

const ImageSection = styled.View`
  width: 75px;
`;

const ContentSection = styled.View`
  flex: 3;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  row-gap: 7px;
`;

const ButtonSection = styled.View`
  flex: 2;
  align-items: flex-end;
  padding-top: 5px;
`;

const ModifiedSmButton = styled.TouchableOpacity`
  padding: 0;
  margin: 0;
`;

function DetailHeader({
  data,
  ButtonComponent,
  type,
}: {
  data: TeamType | UserType;
  ButtonComponent: () => JSX.Element;
  type: 'user' | 'team';
}) {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const onPress = useCallback(() => {
    if (type === 'team') {
      navigation.navigate('Team', {screen: 'Profile'});
    } else {
      navigation.navigate('User', {screen: 'Profile'});
    }
  }, [type]);

  return (
    <Container
      borderColor={colors.borderTopBottomColor}
      paddingHorizontal={dimension.paddingHorizontal}>
      <ImageSection>
        <Image
          width={65}
          source={{
            uri:
              type === 'user'
                ? data?.img
                : `http://192.168.123.104:3000/${data?.img}`,
          }}
          height={65}
          borderRad={type === 'team' ? 15 : 120}
          borderColor={colors.buttonBorderColor}
        />
      </ImageSection>
      <ContentSection>
        <ButtonText color="black" fontSize={26} fontWeight={600}>
          {data?.name}
        </ButtonText>
        <ModifiedSmButton onPress={onPress}>
          <ButtonText
            color={colors.positiveColor}
            fontSize={13}
            fontWeight={400}>
            프로필 변경하기
          </ButtonText>
        </ModifiedSmButton>
      </ContentSection>
      <ButtonSection>
        <ButtonComponent />
      </ButtonSection>
    </Container>
  );
}

export default DetailHeader;
