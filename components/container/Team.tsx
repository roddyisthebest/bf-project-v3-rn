import React from 'react';
import styled from 'styled-components/native';
import {colors} from '../../styles/color';
import TeamType from '../../types/TeamType';
import TeamSet from '../card/TeamSet';
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

function Team({props}: {props: {data: TeamType[]; title: string}}) {
  return (
    <Container bottomColor={colors.itemBorderBottomColor}>
      <TitleSection>
        <TitleText>{props.title}</TitleText>
        <MoreButtonText color={colors.moreButtonColor}>더보기</MoreButtonText>
      </TitleSection>
      <ContentsSection>
        {props.data.map(team => (
          <TeamSet data={team} key={team.id} />
        ))}
      </ContentsSection>
    </Container>
  );
}

export default Team;
