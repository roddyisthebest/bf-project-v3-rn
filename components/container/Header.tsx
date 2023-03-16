import React from 'react';
import styled from 'styled-components/native';
import {colors} from '../../styles/color';

const Container = styled.View<{bottomColor: string}>`
  padding: 22.5px 0;
  border-bottom-color: ${props => props.bottomColor};
  border-bottom-width: 1px;
  row-gap: 10px;
  background-color: white;
  justify-content: space-between;
  align-items: center;
`;

const TitleText = styled.Text`
  font-size: 25px;
  font-weight: 700;
  color: black;
`;
const ContentsText = styled.Text`
  font-size: 12.5px;
  font-weight: 400;
  color: #8a8a8a;
  text-align: center;
`;
function Header({title, contents}: {title: string; contents: string}) {
  return (
    <Container bottomColor={colors.itemBorderBottomColor}>
      <TitleText>{title}</TitleText>
      <ContentsText>{contents}</ContentsText>
    </Container>
  );
}

export default Header;
