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
function Notification() {
  const route = useRoute<
    RouteProp<{
      prop: {
        params: {
          data: {
            code: 'invitation:post';
          };
        };
      };
    }>
  >();

  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const rstAuthState = useRecoilValue(rstAuth);
  const setRstNotificationFlag = useSetRecoilState(rstNotificationFlag);

  useEffect(() => {
    const code = route.params.params.data.code;
    if (code === 'invitation:post' && rstAuthState) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Team'}],
        }),
      );
      setRstNotificationFlag('invitation:post');
    }
  }, [route, navigation, CommonActions, rstAuthState]);

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