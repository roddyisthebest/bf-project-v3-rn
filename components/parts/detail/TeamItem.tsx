import React, {useCallback} from 'react';
import styled from 'styled-components/native';
import dimension from '../../../styles/dimension';
import {Image} from '../../basic/Image';
import {colors} from '../../../styles/color';
import {ButtonText} from '../../basic/Button';
import TeamType from '../../../types/TeamType';
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {
  EncryptedStorageKeyList,
  LoggedInParamList,
} from '../../../navigation/Root';
import {rstMyInfo} from '../../../recoil/user';
import {useRecoilState} from 'recoil';
import EncryptedStorage from 'react-native-encrypted-storage';
import Config from 'react-native-config';

const Container = styled.TouchableOpacity<{paddingHorizontal: number}>`
  flex-direction: row;
  column-gap: 15px;
  align-items: center;
  padding: ${props => `15px ${props.paddingHorizontal}px`};
  background-color: white;
`;

const Text = styled(ButtonText)``;

function TeamItem({data}: {data: TeamType}) {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const [rstUserInfo, setRstUserInfo] = useRecoilState(rstMyInfo);

  const onPress = useCallback(async () => {
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

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Tabs'}],
      }),
    );
  }, [data, navigation, rstUserInfo, setRstUserInfo]);

  return (
    <Container
      paddingHorizontal={dimension.paddingHorizontal}
      onPress={onPress}>
      <Image
        width={30}
        height={30}
        borderRad={5}
        source={{uri: `${Config.API_URL}/${data.img}`}}
        borderColor={colors.buttonBorderColor}
      />
      <Text color="black" fontWeight={500} fontSize={20}>
        {data.name}
      </Text>
    </Container>
  );
}

export default TeamItem;
