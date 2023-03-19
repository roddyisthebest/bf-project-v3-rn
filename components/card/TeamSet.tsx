import React, {useCallback} from 'react';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import {colors} from '../../styles/color';
import TeamType from '../../types/TeamType';
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {LoggedInParamList} from '../../navigation/Root';
import {useRecoilState} from 'recoil';
import {myInfo} from '../../recoil/user';
import EncryptedStorage from 'react-native-encrypted-storage/';
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
function TeamSet({data}: {data: TeamType}) {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const [rstUserInfo, setRstUserInfo] = useRecoilState(myInfo);

  const onPress = useCallback(async () => {
    setRstUserInfo(userInfo => ({...userInfo, team: data}));
    const val = JSON.stringify(rstUserInfo);
    await EncryptedStorage.setItem('myInfo', val);

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Tabs'}],
      }),
    );
  }, [data, navigation, rstUserInfo, setRstUserInfo]);

  return (
    <Container buttonBorderColor={colors.buttonBorderColor} onPress={onPress}>
      <Image
        source={{
          uri: `http://192.168.123.107:3000/${data.img}`,
        }}
      />
    </Container>
  );
}

export default TeamSet;
