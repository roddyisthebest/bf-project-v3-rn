import React, {useCallback} from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
import dimension from '../../../styles/dimension';
import {Image} from '../../basic/Image';
import {colors} from '../../../styles/color';
import {ButtonText, SmButton} from '../../basic/Button';
import TeamType from '../../../types/TeamType';
import {addApplication} from '../../../api/team';
import {rstTeamFlag} from '../../../recoil/flag';
import {useSetRecoilState} from 'recoil';

import Config from 'react-native-config';
const Container = styled.View<{paddingHorizontal: number}>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${props => `15px ${props.paddingHorizontal}px`};
  background-color: white;
`;

const Column = styled.View`
  flex-direction: row;
  column-gap: 15px;
  align-items: center;
`;
const Text = styled(ButtonText)``;

function TeamSearchItem({data}: {data: TeamType}) {
  const setFlag = useSetRecoilState(rstTeamFlag);

  const applyForTeam = useCallback(async () => {
    Alert.alert('가입신청', `${data?.name} (팀)에 가입신청 하시겠습니까?`, [
      {
        text: '취소',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: '신청',
        onPress: async () => {
          await addApplication({teamId: data?.id as number});
          setFlag(prev => ({
            home: {
              update: {
                myteam: prev.home.update.myteam,
                application: true,
                invitation: prev.home.update.invitation,
              },
            },
          }));
          Alert.alert(`${data?.name} (팀)에 가입신청 하였습니다!`);
        },
        style: 'default',
      },
    ]);
  }, [data]);

  return (
    <Container paddingHorizontal={dimension.paddingHorizontal}>
      <Column>
        <Image
          width={30}
          height={30}
          borderRad={5}
          source={{uri: `${Config.API_URL}/${data?.img}`}}
          borderColor={colors.buttonBorderColor}
        />
        <Text color="black" fontWeight={600} fontSize={20}>
          {data?.name}
        </Text>
      </Column>
      <SmButton
        bkg={colors.prayButtonEditBkgColor}
        radius={8}
        onPress={applyForTeam}>
        <ButtonText
          color={colors.prayButtonEditTextColor}
          fontSize={13}
          fontWeight={400}>
          가입신청
        </ButtonText>
      </SmButton>
    </Container>
  );
}

export default TeamSearchItem;
