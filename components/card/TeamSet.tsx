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

    const teamSettingArrString = await EncryptedStorage.getItem(
      EncryptedStorageKeyList.TEAMSETTINGARR,
    );

    if (teamSettingArrString) {
      const teamSettingArr: {id: number; setting: boolean}[] =
        JSON.parse(teamSettingArrString);

      const teamSetting = teamSettingArr.find(
        teamObj => teamObj.id === data.id,
      );
      if (teamSetting) {
        if (teamSetting.setting) {
          return navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Tabs'}],
            }),
          );
        }
        return navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Stack'}],
          }),
        );
      } else {
        return navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Stack'}],
          }),
        );
      }
    } else {
      const arr = [{setting: false, id: data.id}];
      const val = JSON.stringify(arr);

      await EncryptedStorage.setItem(
        EncryptedStorageKeyList.TEAMSETTINGARR,
        val,
      );

      return navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Stack'}],
        }),
      );
    }
  }, [data, navigation, rstUserInfo, setRstUserInfo]);

  return (
    <Container buttonBorderColor={colors.buttonBorderColor} onPress={onPress}>
      <Image
        source={{
          uri: `http://192.168.123.105:3000/${data.img}`,
        }}
      />
    </Container>
  );
}

export default TeamSet;
