import React from 'react';

import styled from 'styled-components/native';
import {colors} from '../../styles/color';
import dimension from '../../styles/dimension';
import TeamType from '../../types/TeamType';
import UserType from '../../types/UserType';
import {ButtonText, SmButton} from '../basic/Button';
import {Image} from '../basic/Image';

const Container = styled.View<{borderColor: string; paddingHorizontal: number}>`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.borderColor};
  padding: ${props => `20px ${props.paddingHorizontal}px`};
  flex-direction: row;
  column-gap: 5px;
  background-color: white;
`;

const ImageSection = styled.View`
  width: 75px;
`;

const ContentSection = styled.View`
  flex: 3;
  justify-content: space-evenly;
  align-items: flex-start;
  flex-direction: column;
`;

const ButtonSection = styled.View`
  flex: 2;
  align-items: flex-end;
`;

const ModifiedSmButton = styled(SmButton)`
  padding: 0;
`;

function DetailHeader({
  data,
  ButtonComponent,
  type,
}: {
  data: TeamType | UserType;
  ButtonComponent: () => JSX.Element;
  type: 'user' | 'team';
}) {
  return (
    <Container
      borderColor={colors.borderTopBottomColor}
      paddingHorizontal={dimension.paddingHorizontal}>
      <ImageSection>
        <Image
          width={65}
          source={{uri: `http://192.168.123.104:3000/${data.img}`}}
          height={65}
          borderRad={type === 'team' ? 15 : 120}
          borderColor={colors.buttonBorderColor}
        />
      </ImageSection>
      <ContentSection>
        <ButtonText color="black" fontSize={26} fontWeight={600}>
          {data.name}
        </ButtonText>
        <ModifiedSmButton bkg="transparent" radius={0}>
          <ButtonText
            color={colors.positiveColor}
            fontSize={13}
            fontWeight={400}>
            프로필 변경하기
          </ButtonText>
        </ModifiedSmButton>
      </ContentSection>
      <ButtonSection>
        <ButtonComponent />
      </ButtonSection>
    </Container>
  );
}

export default DetailHeader;
