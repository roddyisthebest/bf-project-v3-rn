import styled from 'styled-components/native';

const Button = styled.TouchableOpacity<{bkg: string; radius: number}>`
  min-height: 30px;
  background-color: ${props => props.bkg};
  padding: 15px 0;
  border-radius: ${props => `${props.radius}px`};
  justify-content: center;
  column-gap: 10px;
  align-items: center;
  flex-direction: row;
`;

const ButtonText = styled.Text<{color: string}>`
  color: ${props => props.color};
  font-size: 15px;
  font-weight: 500;
`;

export {Button, ButtonText};
