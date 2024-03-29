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
import {
  EncryptedStorageKeyList,
  LoggedInParamList,
} from '../../navigation/Root';
import {useRecoilState} from 'recoil';
import {rstMyInfo} from '../../recoil/user';
import EncryptedStorage from 'react-native-encrypted-storage/';
import {getService} from '../../api/user';
import {AxiosError} from 'axios';
import Config from 'react-native-config';
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
  const [rstUserInfo, setRstUserInfo] = useRecoilState(rstMyInfo);

  const onPress = useCallback(async () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Tabs'}],
      }),
    );
    const obj = {
      ...rstUserInfo,
      team: data,
    };
    setRstUserInfo(obj);
    const objToString = JSON.stringify(obj);
    await EncryptedStorage.setItem(
      EncryptedStorageKeyList.USERINFO,
      objToString,
    );
  }, [data, navigation, rstUserInfo, setRstUserInfo]);

  return (
    <Container buttonBorderColor={colors.buttonBorderColor} onPress={onPress}>
      <Image
        source={{
          uri: `${Config.API_URL}/${data.img}`,
        }}
      />
    </Container>
  );
}

export default TeamSet;
