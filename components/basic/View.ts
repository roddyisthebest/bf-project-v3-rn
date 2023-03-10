import styled from 'styled-components/native';

const GapRowView = styled.View<{
  gap: number;
  marginTop: number;
  marginBottom: number;
  paddingVertical: number;
  paddingHorizontal: number;
}>`
  row-gap: ${props => props.gap}px;
  margin-top: ${props => props.marginTop}px;
  margin-bottom: ${props => props.marginBottom}px;
  padding: ${props =>
    `${props.paddingVertical}px ${props.paddingHorizontal}px`};
`;

export {GapRowView};
