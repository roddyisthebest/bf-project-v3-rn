import React from 'react';
import styled from 'styled-components/native';
import {ButtonText} from '../../basic/Button';

const Wrapper = styled.View<{paddingTop: number}>`
  flex: 1;
  align-items: center;
  padding-top: ${props => props.paddingTop}px;
`;

const Container = styled.View`
  background-color: black;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
`;

const Text = styled(ButtonText)``;

function ListEmptyComponent({
  text,
  paddingTop,
}: {
  text: string;
  paddingTop: number;
}) {
  return (
    <Wrapper paddingTop={paddingTop}>
      <Container>
        <Text color="white" fontWeight={700} fontSize={15}>
          {text}
        </Text>
      </Container>
    </Wrapper>
  );
}

export default ListEmptyComponent;
