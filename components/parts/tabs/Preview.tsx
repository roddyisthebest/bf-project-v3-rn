import React from 'react';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../../styles/color';
import dimension from '../../../styles/dimension';
import {Platform} from 'react-native';

const Container = styled.View<{borderColor: string; height: number}>`
  width: 100%;
  height: ${props => props.height}px;
  border-width: 1px;
  border-color: ${props => props.borderColor};
  border-radius: 30px;
`;

const Image = styled(FastImage)`
  width: 100%;
  height: 100%;
  border-radius: 30px;
`;

const DeleteButton = styled.Pressable`
  width: 30px;
  height: 30px;
  border-radius: 25px;
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 100;
  background-color: white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  align-items: center;
  justify-content: center;
`;
function Preview({uri, reset}: {uri: string; reset: () => void}) {
  return (
    <Container
      borderColor={colors.bottomSheetItemBorderColor}
      height={
        Platform.OS === 'ios' ? dimension.height * 0.3 : dimension.height * 0.4
      }>
      <DeleteButton onPress={reset}>
        <Icon name="close-outline" color="black" size={18} />
      </DeleteButton>
      <Image source={{uri}} />
    </Container>
  );
}

export default Preview;
