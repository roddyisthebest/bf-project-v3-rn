import styled from 'styled-components/native';

const Label = styled.Text<{color: string}>`
  color: ${props => props.color};
  font-size: 15px;
  font-weight: 600;
`;

const Input = styled.TextInput<{borderColor: string}>`
  font-size: 18px;
  border-bottom-color: ${props => props.borderColor};
  border-bottom-width: 1px;
  padding: 8px 0;
  font-weight: 500;
`;

const TextArea = styled.TextInput<{borderColor: string}>`
  border-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.borderColor};
  height: 100px;
  color: black;
  padding: 5px 0 10px 0;
`;
export {Label, Input, TextArea};
