import React from 'react';
import styled from 'styled-components/native';
import {colors} from '../../styles/color';

const Container = styled.View<{bottomColor: string}>`
  padding: 22.5px 20px;
  border-bottom-color: ${props => props.bottomColor};
  border-bottom-width: 1px;
  row-gap: 10px;
  background-color: white;
`;
const TitleSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TitleText = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: black;
`;

const ContentsSection = styled.View``;

const ContentsText = styled.Text`
  font-size: 12.5px;
  font-weight: 400;
  color: #8a8a8a;
`;

function Setting({
  children,
  title,
  contents,
}: {
  children: React.ReactNode;
  title: string;
  contents: string;
}) {
  return (
    <Container bottomColor={colors.itemBorderBottomColor}>
      <TitleSection>
        <TitleText>{title}</TitleText>
        {children}
      </TitleSection>
      <ContentsSection>
        <ContentsText>{contents}</ContentsText>
      </ContentsSection>
    </Container>
  );
}

export default Setting;
