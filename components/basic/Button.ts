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

const SmButton = styled(Button)`
  /* height: 20px; */
  padding: 5px 12.5px;
  column-gap: 5px;
`;

const ButtonText = styled.Text<{
  color: string;
  fontSize: number;
  fontWeight: number;
}>`
  color: ${props => props.color};
  font-size: ${props => props.fontSize}px;
  font-weight: ${props => props.fontWeight};
`;

ButtonText.defaultProps = {
  fontWeight: 500,
};

export {Button, SmButton, ButtonText};
