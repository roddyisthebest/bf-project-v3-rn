import React, {useState} from 'react';
import UserType from '../../../types/UserType';
import styled from 'styled-components/native';
import dimension from '../../../styles/dimension';
import {Image} from '../../basic/Image';
import {colors} from '../../../styles/color';
import {ButtonText} from '../../basic/Button';
import {ActivityIndicator} from 'react-native';

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
  onPress: (id: number) => Promise<any>;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Container
      paddingHorizontal={dimension.paddingHorizontal}
      onPress={async () => {
        setLoading(true);
        await onPress(data.id);
        setLoading(false);
      }}
      disabled={loading}>
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
      {loading && <ActivityIndicator color={colors.loadingIconColor} />}
    </Container>
  );
}

export default UserSearchItem;
