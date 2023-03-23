import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ButtonText} from '../../basic/Button';
import {colors} from '../../../styles/color';
const Container = styled.Pressable<{borderColor: string}>`
  height: 50px;
  background-color: white;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.borderColor};
  justify-content: center;
  align-items: center;
  column-gap: 10px;
  flex-direction: row;
`;

const Block = styled.View<{bkg: string}>`
  height: 15px;
  background-color: ${props => props.bkg};
`;

function DateHeader({
  onPress,
  weekend,
}: {
  onPress: () => void;
  weekend: string;
}) {
  return (
    <>
      <Block bkg={colors.background} />
      <Container borderColor={colors.borderTopBottomColor} onPress={onPress}>
        <Icon name="calendar-outline" color="black" size={15} />
        <ButtonText color="black" fontSize={15} fontWeight={600}>
          {weekend}
        </ButtonText>
      </Container>
      <Block bkg={colors.background} />
    </>
  );
}
export default DateHeader;
