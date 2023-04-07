import React from 'react';
import styled from 'styled-components/native';
import {colors} from '../../styles/color';
import dimension from '../../styles/dimension';
import {ButtonText} from '../basic/Button';
import {GapRowView} from '../basic/View';

import PenaltyType from '../../types/PenaltyType';

const Container = styled(GapRowView)<{borderColor: string}>`
  border-bottom-color: ${props => props.borderColor};
  border-bottom-width: 1px;
  background-color: white;
`;

const ContentSection = styled(GapRowView)``;

const ContentColumn = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ContentTitleText = styled(ButtonText)``;

const ContentSubTitleText = styled(ButtonText)``;

function PenaltyReadOnly({data}: {data: PenaltyType}) {
  return (
    <Container
      paddingHorizontal={dimension.paddingHorizontal}
      paddingVertical={25}
      marginTop={0}
      marginBottom={0}
      borderColor={colors.cardBorderBottomColor}
      gap={10}>
      <ContentSection
        paddingHorizontal={0}
        paddingVertical={0}
        marginTop={0}
        marginBottom={0}
        gap={12.5}>
        <ContentColumn>
          <ContentTitleText color="black" fontWeight={600} fontSize={20}>
            금액
          </ContentTitleText>
          <ContentSubTitleText
            color={colors.subTitleColor}
            fontWeight={600}
            fontSize={16}>
            {data?.paper}
          </ContentSubTitleText>
        </ContentColumn>
        <ContentColumn>
          <ContentTitleText color="black" fontWeight={600} fontSize={20}>
            날짜
          </ContentTitleText>
          <ContentSubTitleText
            color={colors.subTitleColor}
            fontWeight={600}
            fontSize={16}>
            {data.weekend}
          </ContentSubTitleText>
        </ContentColumn>
      </ContentSection>
    </Container>
  );
}

export default React.memo(PenaltyReadOnly);
