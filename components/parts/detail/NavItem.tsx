import React from 'react';
import styled from 'styled-components/native';
import {ButtonText} from '../../basic/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import dimension from '../../../styles/dimension';
const Container = styled.Pressable`
  height: 50px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: white;
`;

const Text = styled(ButtonText)``;

function NavItem({text, onPress}: {text: string; onPress: () => void}) {
  return (
    <Container
      onPress={onPress}
      style={{paddingHorizontal: dimension.paddingHorizontal}}>
      <Text color="black" fontWeight={500} fontSize={18}>
        {text}
      </Text>
      <Icon name="chevron-forward-outline" color="#ABABAB" size={20} />
    </Container>
  );
}

export default NavItem;
