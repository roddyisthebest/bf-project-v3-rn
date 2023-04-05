import React from 'react';
import styled from 'styled-components/native';
import dimension from '../../../styles/dimension';
import {Image} from '../../basic/Image';
import {colors} from '../../../styles/color';
import {ButtonText, SmButton} from '../../basic/Button';
import InvitationType from '../../../types/InvitationType';

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

function UserInvitationItem({
  data,
  onPress,
}: {
  data: InvitationType;
  onPress: (id: number) => void;
}) {
  return (
    <Container paddingHorizontal={dimension.paddingHorizontal}>
      <Column>
        <Image
          width={30}
          height={30}
          borderRad={30}
          source={{uri: `${data?.User?.img}`}}
          borderColor={colors.buttonBorderColor}
        />
        <Text color="black" fontWeight={600} fontSize={20}>
          {data?.User?.name}
        </Text>
      </Column>
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
    </Container>
  );
}

export default UserInvitationItem;