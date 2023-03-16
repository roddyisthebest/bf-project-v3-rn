import React from 'react';
import styled from 'styled-components/native';
import {colors} from '../../styles/color';
import dimension from '../../styles/dimension';
const Wrapper = styled.SafeAreaView<{bkg: string}>`
  flex: 1;

  background-color: ${props => props.bkg};
`;

const ScrollableWrapper = styled.ScrollView<{bkg: string}>`
  flex: 1;
  background-color: ${props => props.bkg};
`;

const Block = styled.View<{width: number}>`
  width: ${props => props.width}px;
  height: 15px;
`;
const Container = styled.View<{
  width: number;
  height: number;
  isItWhite: boolean;
}>`
  width: ${props => props.width}px;
  background-color: ${props => (props.isItWhite ? 'white' : '#F4F4F4')};
  min-height: ${props => props.height}px;
`;

function Layout({
  scrollable,
  children,
  isItWhite,
}: {
  scrollable: boolean;
  children: React.ReactNode;
  isItWhite: boolean;
}) {
  return scrollable ? (
    <ScrollableWrapper bkg={colors.background}>
      <Block width={dimension.width} />
      <Container
        width={dimension.width}
        height={dimension.height}
        isItWhite={isItWhite}>
        {children}
      </Container>
    </ScrollableWrapper>
  ) : (
    <Wrapper bkg={colors.background}>
      <Block width={dimension.width} />
      <Container
        width={dimension.width}
        height={dimension.height}
        isItWhite={isItWhite}>
        {children}
      </Container>
    </Wrapper>
  );
}

export default Layout;
