import React from 'react';
import styled from 'styled-components/native';
import dimension from '../../../styles/dimension';
import {Image} from '../../basic/Image';
import {colors} from '../../../styles/color';
import {ButtonText, SmButton} from '../../basic/Button';
import TeamType from '../../../types/TeamType';

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

function TeamInvitationItem({
  data,
  onPress,
}: {
  data: TeamType;
  onPress: (id: number) => void;
}) {
  return (
    <Container paddingHorizontal={dimension.paddingHorizontal}>
      <Column>
        <Image
          width={30}
          height={30}
          borderRad={5}
          source={{uri: `${data?.img}`}}
          borderColor={colors.buttonBorderColor}
        />
        <Text color="black" fontWeight={600} fontSize={25}>
          {data?.name}
        </Text>
      </Column>
      <Column>
        <SmButton
          bkg={colors.prayButtonEditBkgColor}
          radius={8}
          onPress={() => onPress(data.id)}>
          <ButtonText
            color={colors.prayButtonEditTextColor}
            fontSize={13}
            fontWeight={400}>
            수락하기
          </ButtonText>
        </SmButton>
        <SmButton
          bkg={colors.prayButtonDeleteBkgColor}
          radius={8}
          onPress={() => onPress(data.id)}>
          <ButtonText
            color={colors.prayButtonDeleteTextColor}
            fontSize={13}
            fontWeight={400}>
            삭제하기
          </ButtonText>
        </SmButton>
      </Column>
    </Container>
  );
}

export default TeamInvitationItem;
