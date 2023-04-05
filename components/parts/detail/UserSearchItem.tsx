import React from 'react';
import UserType from '../../../types/UserType';
import styled from 'styled-components/native';
import dimension from '../../../styles/dimension';
import {Image} from '../../basic/Image';
import {colors} from '../../../styles/color';
import {ButtonText} from '../../basic/Button';

const Container = styled.TouchableOpacity<{paddingHorizontal: number}>`
  flex-direction: row;
  column-gap: 15px;
  align-items: center;
  padding: ${props => `15px ${props.paddingHorizontal}px`};
  background-color: white;
`;

const Text = styled(ButtonText)``;

function UserSearchItem({
  data,
  onPress,
}: {
  data: UserType;
  onPress: (id: number) => void;
}) {
  return (
    <Container
      paddingHorizontal={dimension.paddingHorizontal}
      onPress={() => onPress(data.id)}>
      <Image
        width={30}
        height={30}
        borderRad={30}
        source={{uri: `${data.img}`}}
        borderColor={colors.buttonBorderColor}
      />
      <Text color="black" fontWeight={500} fontSize={20}>
        {data.name}
      </Text>
    </Container>
  );
}

export default UserSearchItem;
