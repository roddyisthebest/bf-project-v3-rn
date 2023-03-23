import styled from 'styled-components/native';

const Item = styled.Pressable<{borderColor: string}>`
  border-bottom-color: ${props => props.borderColor};
  border-bottom-width: 0.85px;
  height: 50px;
  align-items: center;
  justify-content: center;
`;

export {Item};
