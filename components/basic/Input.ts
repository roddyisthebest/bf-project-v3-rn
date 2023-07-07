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

const TextArea = styled.TextInput<{borderColor: string; isDisplay: boolean}>`
  border-style: solid;
  border-bottom-width: ${props => (props.isDisplay ? '0px' : '1px')};
  border-bottom-color: ${props => props.borderColor};
  height: ${props => (props.isDisplay ? 'auto' : '150px')};
  color: black;
  padding: 5px 0 10px 0;
  font-weight: 400;
  line-height: 20px;
`;
export {Label, Input, TextArea};
