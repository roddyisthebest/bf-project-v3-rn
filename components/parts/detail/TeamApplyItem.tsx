import React from 'react';
import styled from 'styled-components/native';
import dimension from '../../../styles/dimension';
import {Image} from '../../basic/Image';
import {colors} from '../../../styles/color';
import {ButtonText, SmButton} from '../../basic/Button';
import InvitationPropType from '../../../types/InvitationPropType';
import {ActivityIndicator} from 'react-native';
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

function TeamApplyItem({
  data,
  onPress,
  index,
}: {
  data: InvitationPropType;
  onPress: (id: number, index: number) => void;
  index: number;
}) {
  return (
    <Container paddingHorizontal={dimension.paddingHorizontal}>
      <Column>
        <Image
          width={30}
          height={30}
          borderRad={5}
          source={{uri: `${Config.API_URL}/${data?.Team?.img}`}}
          borderColor={colors.buttonBorderColor}
        />
        <Text color="black" fontWeight={600} fontSize={20}>
          {data?.Team?.name}
        </Text>
      </Column>
      <Column>
        {data.loading ? (
          <ActivityIndicator color={colors.loadingIconColor} />
        ) : (
          <>
            <SmButton
              bkg={colors.prayButtonDeleteBkgColor}
              radius={8}
              onPress={() => onPress(data.id, index)}>
              <ButtonText
                color={colors.prayButtonDeleteTextColor}
                fontSize={13}
                fontWeight={400}>
                취소하기
              </ButtonText>
            </SmButton>
          </>
        )}
      </Column>
    </Container>
  );
}

export default TeamApplyItem;
