import React, {useCallback} from 'react';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import {colors} from '../../styles/color';
import {useSetRecoilState} from 'recoil';
import InvitationType from '../../types/InvitationType';
import {Alert} from 'react-native';
import {setApproveInvitation} from '../../api/team';
import {rstTeamFlag} from '../../recoil/flag';

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
  const setFlag = useSetRecoilState(rstTeamFlag);

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
              await setApproveInvitation({id: data?.id});
              setFlag(prev => ({
                home: {
                  update: {
                    myteam: true,
                    invitation: true,
                    application: prev.home.update.application,
                  },
                },
              }));
              Alert.alert(
                `팀 ${data?.Team?.name}에 성공적으로 가입되었습니다.`,
              );
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
