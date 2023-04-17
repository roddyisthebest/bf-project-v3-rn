import React, {useCallback, useState} from 'react';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import {colors} from '../../styles/color';
import {useSetRecoilState} from 'recoil';
import InvitationType from '../../types/InvitationType';
import {ActivityIndicator, Alert} from 'react-native';
import {setApproveInvitation} from '../../api/team';
import {rstTeamFlag} from '../../recoil/flag';
import {AxiosError} from 'axios';
import {response as responseType} from '../../api';
const Container = styled.TouchableOpacity<{buttonBorderColor: string}>`
  border-radius: 10px;
  border-color: ${props => props.buttonBorderColor};
  border-width: 1px;
`;

const LoadingContainer = styled.View`
  width: 110px;
  height: 110px;
  position: absolute;
  z-index: 10;
  align-items: center;
  justify-content: center;
  background-color: #00000077;
  border-radius: 10px;
`;

const Image = styled(FastImage)`
  width: 110px;
  height: 110px;
  border-radius: 10px;
`;
function Invitation({data, active}: {data: InvitationType; active: boolean}) {
  const setFlag = useSetRecoilState(rstTeamFlag);

  const [loading, setLoading] = useState<boolean>(false);

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
                setLoading(true);
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
              } catch (error) {
                const {response} = error as unknown as AxiosError<responseType>;
                if (response?.status === 403) {
                  setFlag(prev => ({
                    home: {
                      update: {
                        myteam: true,
                        invitation: true,
                        application: prev.home.update.application,
                      },
                    },
                  }));
                }
              } finally {
                setLoading(false);
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
    <Container
      buttonBorderColor={colors.buttonBorderColor}
      onPress={onPress}
      disabled={loading}>
      {loading && (
        <LoadingContainer>
          <ActivityIndicator color="white" />
        </LoadingContainer>
      )}

      <Image
        source={{
          uri: `http://192.168.123.104:3000/${data?.Team?.img}`,
        }}
      />
    </Container>
  );
}

export default Invitation;
