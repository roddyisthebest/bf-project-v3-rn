import React, {useCallback} from 'react';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import {colors} from '../../styles/color';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../navigation/Root';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {rstMyInfo} from '../../recoil/user';
import InvitationType from '../../types/InvitationType';
import {Alert} from 'react-native';
import {setApprove} from '../../api/team';
import {updateTeamFlag} from '../../recoil/flag';

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
function Invitation({data, active}: {data: InvitationType; active: boolean}) {
  const setFlag = useSetRecoilState(updateTeamFlag);

  console.log(data);
  const onPress = useCallback(async () => {
    if (active) {
      Alert.alert(
        '초대 수락',
        `정말 팀 ${data?.Team?.name}의 초대에 수락하시겠습니까?`,
        [
          {
            text: '취소',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: '수락',
            onPress: async () => {
              try {
                await setApprove({id: data?.id});
                setFlag(true);
                Alert.alert(
                  `팀 ${data?.Team?.name}에 성공적으로 가입되었습니다.`,
                );
              } catch (e) {
                console.log(e);
              }
            },
            style: 'default',
          },
        ],
      );
    } else {
      Alert.alert(`가입 신청 - ${data?.Team?.name}`, data?.Team?.introducing);
    }
  }, [data]);

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
