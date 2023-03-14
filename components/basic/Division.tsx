import styled from 'styled-components/native';
import React from 'react';
import {colors} from '../../styles/color';
const Container = styled.View`
  height: 20px;
  flex-direction: row;
  align-items: center;
  column-gap: 10px;
`;

const Line = styled.View<{bkg: string}>`
  flex: 3;
  height: 1px;
  background-color: ${props => props.bkg};
`;

const TextWrapper = styled.View`
  height: 100%;
  background-color: white;
  flex-direction: row;
  align-items: center;
`;

const Text = styled.Text<{color: string}>`
  color: ${props => props.color};
  font-size: 15px;
  font-weight: 600;
`;

function Division({text}: {text: string}) {
  return (
    <Container>
      <Line bkg={colors.inputLineColor} />
      <TextWrapper>
        <Text color={colors.inputLabelColor}>{text}</Text>
      </TextWrapper>
      <Line bkg={colors.inputLineColor} />
    </Container>
  );
}

export default Division;
