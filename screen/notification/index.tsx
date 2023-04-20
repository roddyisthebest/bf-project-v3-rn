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
import {LoggedInParamList} from '../../navigation/Root';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {rstAuth} from '../../recoil/auth';
import {rstNotificationFlag} from '../../recoil/flag';
import {rstMyInfo} from '../../recoil/user';
import TeamType from '../../types/TeamType';
import NtCodeType from '../../types/NtCodeType';
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

  useEffect(() => {
    const code = route.params.params.data.code;

    if (rstAuthState) {
      if (code.includes('invitation') || code.includes('application')) {
        setRstMyInfo(prev => ({...prev, team: null}));
        setRstNotificationFlag(code);
      } else {
        const teamData: TeamType = JSON.parse(route.params.params.data.team);
        console.log(teamData, 'teamData');
        setRstMyInfo(prev => ({...prev, team: teamData}));
        if (code === 'penalty:set') {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Tabs', params: {screen: 'Penalty'}}],
            }),
          );
        } else if (code === 'tweet:warning') {
          setRstNotificationFlag('tweet:warning');
          console.log('noti', teamData);
          setRstMyInfo(prev => ({...prev, team: teamData}));
          console.log('이동');
          navigation.navigate('Tabs', {screen: 'Home'});
        }
      }
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
