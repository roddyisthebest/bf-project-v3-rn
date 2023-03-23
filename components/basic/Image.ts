import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';

const Image = styled(FastImage)<{
  width: number;
  height: number;
  borderRad: number;
  borderColor: string;
}>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  border-radius: ${props => props.borderRad}px;
  border-color: ${props => props.borderColor};
  border-width: 1px;
`;

export {Image};
