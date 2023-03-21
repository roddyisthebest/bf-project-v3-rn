import styled from 'styled-components/native';

const Wrapper = styled.View``;

const Item = styled.View<{borerColor: string}>`
  border-bottom-color: ${props => props.borerColor};
  border-bottom-width: 0.85px;
  height: 50px;
  align-items: center;
  justify-content: center;
`;

export {Item};
