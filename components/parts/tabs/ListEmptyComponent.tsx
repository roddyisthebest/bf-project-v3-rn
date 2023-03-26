import React from 'react';
import styled from 'styled-components/native';
import {ButtonText} from '../../basic/Button';

const Container = styled.View`
  margin: 25px 100px;
  background-color: black;
  height: 40px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
`;

const Text = styled(ButtonText)``;

function ListEmptyComponent({text}: {text: string}) {
  return (
    <Container>
      <Text color="white" fontWeight={700} fontSize={15}>
        {text}
      </Text>
    </Container>
  );
}

export default ListEmptyComponent;
