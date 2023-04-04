import React, {useCallback} from 'react';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import {colors} from '../../styles/color';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../navigation/Root';
import {useRecoilState} from 'recoil';
import {rstMyInfo} from '../../recoil/user';

import InvitationType from '../../types/InvitationType';

const Container = styled.TouchableOpacity<{buttonBorderColor: string}>`
  border-radius: 10px;
  border-color: ${props => props.buttonBorderColor};
  border-width: 1px;
`;

const Image = styled(FastImage)`
  width: 110px;
  height: 110px;
  border-radius: 10px;
`;
function Invitation({data}: {data: InvitationType}) {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const [rstUserInfo, setRstUserInfo] = useRecoilState(rstMyInfo);

  const onPress = useCallback(async () => {}, []);

  return (
    <Container buttonBorderColor={colors.buttonBorderColor} onPress={onPress}>
      <Image
        source={{
          uri: `http://192.168.123.104:3000/${data?.Team?.img}`,
        }}
      />
    </Container>
  );
}

export default Invitation;
