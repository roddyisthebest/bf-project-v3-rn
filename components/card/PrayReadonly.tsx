import React from 'react';
import styled from 'styled-components/native';
import {colors} from '../../styles/color';
import dimension from '../../styles/dimension';
import PrayType from '../../types/PrayType';
import {ButtonText} from '../basic/Button';

const Container = styled.View<{
  borderColor: string;
  paddingVertical: number;
  paddingHorizontal: number;
}>`
  border-bottom-color: ${props => props.borderColor};
  border-bottom-width: 1px;
  background-color: white;
  flex-direction: row;
  column-gap: 20px;
  padding: ${props =>
    `${props.paddingVertical}px ${props.paddingHorizontal}px`};
`;

const TitleSection = styled.View`
  flex: 1;
`;

const TitleText = styled(ButtonText)``;

const DateText = styled(ButtonText)``;

function PrayReadonly({data}: {data: PrayType}) {
  return (
    <Container
      borderColor={colors.cardBorderBottomColor}
      paddingHorizontal={dimension.paddingHorizontal}
      paddingVertical={dimension.paddingVertical}>
      <TitleSection>
        <TitleText color="gray" fontWeight={400} fontSize={12.5}>
          {data.content.length === 0 ? '새로운 기도제목입니다.' : data.content}
        </TitleText>
      </TitleSection>

      <DateText color="black" fontWeight={600} fontSize={12.5}>
        {data.weekend}
      </DateText>
    </Container>
  );
}

export default React.memo(PrayReadonly);
