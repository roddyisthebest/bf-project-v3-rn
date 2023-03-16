import React from 'react';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../../styles/color';

const Container = styled.View<{bottomColor: string}>`
  padding: 22.5px 20px;
  border-bottom-color: ${props => props.bottomColor};
  border-bottom-width: 1px;
  row-gap: 17.5px;
  background-color: white;
`;

const TitleSection = styled.Pressable`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const TitleText = styled.Text`
  font-size: 25px;
  font-weight: 700;
  color: black;
`;

const MoreButtonText = styled.Text<{color: string}>`
  color: ${props => props.color};
  font-size: 12.5px;
`;

const ContentsSection = styled.View`
  flex-direction: row;
  column-gap: 10px;
`;

const ContentsButton = styled.TouchableOpacity<{buttonBorderColor: string}>`
  border-radius: 10px;
  border-color: ${props => props.buttonBorderColor};
  border-width: 1px;
`;

const ContentsImage = styled(FastImage)`
  width: 110px;
  height: 110px;
  border-radius: 10px;
`;

function Team({title}: {title: string}) {
  return (
    <Container bottomColor={colors.itemBorderBottomColor}>
      <TitleSection>
        <TitleText>{title}</TitleText>
        <MoreButtonText color={colors.moreButtonColor}>더보기</MoreButtonText>
      </TitleSection>
      <ContentsSection>
        <ContentsButton buttonBorderColor={colors.buttonBorderColor}>
          <ContentsImage
            source={{
              uri: 'https://koreaboo-cdn.storage.googleapis.com/2017/08/Satomi-Ishihara.jpeg',
            }}
          />
        </ContentsButton>
        <ContentsButton buttonBorderColor={colors.buttonBorderColor}>
          <ContentsImage
            source={{
              uri: 'https://koreaboo-cdn.storage.googleapis.com/2017/08/Satomi-Ishihara.jpeg',
            }}
          />
        </ContentsButton>
      </ContentsSection>
    </Container>
  );
}

export default Team;
