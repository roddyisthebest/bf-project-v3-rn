import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Pressable, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import {LoggedInParamList} from '../../navigation/Root';
import {colors} from '../../styles/color';
import TeamType from '../../types/TeamType';
import {ButtonText} from '../basic/Button';
import TeamSet from '../card/TeamSet';

const Container = styled.View<{bottomColor: string}>`
  padding: 22.5px 20px 0 20px;
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
  min-height: 80px;
`;

const EmptyView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const EmptyText = styled(ButtonText)``;
function Team({
  props,
}: {
  props: {
    data: TeamType[];
    title: string;
    type: 'default' | 'invitation' | 'apply';
  };
}) {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const onPress = useCallback(() => {
    if (props.data.length !== 0) {
      if (props.type === 'default') {
        navigation.navigate('Team', {screen: 'MyTeams'});
      } else if (props.type === 'invitation') {
        navigation.navigate('Team', {screen: 'InvitedTeams'});
      } else if (props.type === 'apply') {
        navigation.navigate('Team', {screen: 'AppliedTeams'});
      }
    }
  }, [props]);

  const renderItem = ({item}: {item: TeamType}) => <TeamSet data={item} />;

  return (
    <Container bottomColor={colors.itemBorderBottomColor}>
      <TitleSection onPress={onPress}>
        <TitleText>{props.title}</TitleText>
        {props.data.length !== 0 && (
          <MoreButtonText color={colors.moreButtonColor}>더보기</MoreButtonText>
        )}
      </TitleSection>
      <ContentsSection>
        <FlatList
          data={props.data}
          renderItem={renderItem}
          contentContainerStyle={{flexGrow: 1, paddingBottom: 22.5}}
          keyExtractor={item => item.id.toString()}
          horizontal
          scrollEnabled={true}
          showsHorizontalScrollIndicator={true}
          ItemSeparatorComponent={() => <View style={{width: 15}} />}
          ListEmptyComponent={
            <EmptyView>
              <EmptyText
                color={colors.moreButtonColor}
                fontSize={15}
                fontWeight={400}>
                데이터가 없습니다.
              </EmptyText>
            </EmptyView>
          }
        />
      </ContentsSection>
    </Container>
  );
}

export default Team;
