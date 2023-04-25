import {ActivityIndicator} from 'react-native';
import React, {useEffect} from 'react';
import {LoadingContainer} from '../../components/basic/View';
import {colors} from '../../styles/color';
import {ButtonText} from '../../components/basic/Button';
import {
  CommonActions,
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  EncryptedStorageKeyList,
  LoggedInParamList,
} from '../../navigation/Root';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {rstAuth} from '../../recoil/auth';
import {rstNotificationFlag} from '../../recoil/flag';
import {rstMyInfo, rstMyInfoType} from '../../recoil/user';
import TeamType from '../../types/TeamType';
import NtCodeType from '../../types/NtCodeType';
import EncryptedStorage from 'react-native-encrypted-storage';
function Notification() {
  const route = useRoute<
    RouteProp<{
      prop: {
        params: {
          data: {
            code: NtCodeType;
            team: string;
          };
        };
      };
    }>
  >();

  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const rstAuthState = useRecoilValue(rstAuth);

  const setRstNotificationFlag = useSetRecoilState(rstNotificationFlag);
  const setRstMyInfo = useSetRecoilState(rstMyInfo);

  const setEncryptStorage = async (team: TeamType) => {
    const userInfoString = await EncryptedStorage.getItem(
      EncryptedStorageKeyList.USERINFO,
    );
    const userInfo: rstMyInfoType = JSON.parse(userInfoString as string);
    userInfo.team = team;
    await EncryptedStorage.setItem(
      EncryptedStorageKeyList.USERINFO,
      JSON.stringify(userInfo),
    );
  };
  useEffect(() => {
    const code = route.params.params.data.code;
    if (rstAuthState) {
      if (code.includes('invitation') || code.includes('application')) {
        setRstNotificationFlag(code);
        setRstMyInfo(prev => ({...prev, team: null}));
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Team'}],
          }),
        );
      } else {
        console.log(route.params.params.data.team);
        const teamData: TeamType = JSON.parse(route.params.params.data.team);
        console.log(teamData, 'teamData');
        setRstMyInfo(prev => ({...prev, team: teamData}));
        setEncryptStorage(teamData);
        if (code === 'penalty:set') {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Tabs', params: {screen: 'Penalty'}}],
            }),
          );
        } else if (code === 'tweet:warning') {
          setRstNotificationFlag('tweet:warning');
          setRstMyInfo(prev => ({...prev, team: teamData}));
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Tabs', params: {screen: 'Home'}}],
            }),
          );
        }
      }
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Auth'}],
        }),
      );
    }
  }, [rstAuthState, navigation]);

  return (
    <LoadingContainer>
      <ActivityIndicator color={colors.loadingIconColor} size={50} />
      <ButtonText
        color="black"
        fontSize={20}
        fontWeight={600}
        style={{marginTop: 20}}>
        잠시만 기다려주세요.
      </ButtonText>
    </LoadingContainer>
  );
}
export default Notification;
