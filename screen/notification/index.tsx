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
import {rstMyInfo} from '../../recoil/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import TeamType from '../../types/TeamType';
function Notification() {
  const route = useRoute<
    RouteProp<{
      prop: {
        params: {
          data: {
            code:
              | 'invitation:post'
              | 'application:delete'
              | 'application:approve'
              | 'penalty:set';
            team: string;
          };
        };
      };
    }>
  >();

  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const rstAuthState = useRecoilValue(rstAuth);
  const {team} = useRecoilValue(rstMyInfo);
  const setRstNotificationFlag = useSetRecoilState(rstNotificationFlag);
  const setRstMyInfo = useSetRecoilState(rstMyInfo);

  const resetPN = async () => {
    await EncryptedStorage.removeItem(EncryptedStorageKeyList.PUSHNOTIFICATION);
  };
  useEffect(() => {
    const code = route.params.params.data.code;
    resetPN();
    if (rstAuthState) {
      setRstMyInfo(prev => ({...prev, team: null}));
      if (code === 'invitation:post') {
        setRstNotificationFlag(code);
      } else if (code === 'application:delete') {
        setRstNotificationFlag(code);
      } else if (code === 'application:approve') {
      }
    }

    if (rstAuthState && team !== null) {
      if (code === 'penalty:set') {
        console.log(route.params.params.data.team);
        const teamData: TeamType = JSON.parse(route.params.params.data.team);
        setRstMyInfo(prev => ({...prev, team: teamData}));

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Tabs', params: {screen: 'Penalty'}}],
          }),
        );
      }
    }
  }, [route, navigation, CommonActions, rstAuthState, team]);

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
