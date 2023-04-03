import React, {useState} from 'react';
import styled from 'styled-components/native';
import {colors} from '../../../../styles/color';
import Icon from 'react-native-vector-icons/Ionicons';
import {FlatList, View} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../../../navigation/Root';

import TeamSearchItem from '../../../../components/parts/detail/TeamSearchItem';
import ListEmptyComponent from '../../../../components/parts/tabs/ListEmptyComponent';
import dimension from '../../../../styles/dimension';

import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../../recoil/user';
import TeamType from '../../../../types/TeamType';

const SearchSection = styled.View<{
  paddingVertical: number;
  paddingHorizontal: number;
  borderColor: string;
}>`
  padding: ${props =>
    `${props.paddingHorizontal}px ${props.paddingVertical}px`};
  border-bottom-color: ${props => props.borderColor};
  border-bottom-width: 1px;
  background-color: white;
  margin-bottom: 15px;
`;

const SearchWrapper = styled.View<{borderColor: string}>`
  height: 55px;
  border-color: ${props => props.borderColor};
  border-width: 1px;
  border-radius: 50px;
  padding: 0 20px;
  flex-direction: row;
  align-items: center;
  column-gap: 10px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  color: black;
  font-size: 17px;
`;

function TeamSearching() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const {team} = useRecoilValue(rstMyInfo);
  const date = new Date();
  const [data, setData] = useState<TeamType[]>([
    {
      bossId: 1,
      createdAt: date,
      deletedAt: date,
      id: 1,
      img: 'https://gdimg.gmarket.co.kr/835583398/still/400?ver=1629339046',
      introducing: 'asdasda',
      name: '티샤츄',
      updatedAt: date,
      userteam: null,
    },
    {
      bossId: 1,
      createdAt: date,
      deletedAt: date,
      id: 2,
      img: 'https://gdimg.gmarket.co.kr/835583398/still/400?ver=1629339046',
      introducing: 'asdasda',
      name: '티샤츄',
      updatedAt: date,
      userteam: null,
    },
  ]);
  const [keyword, setKeyword] = useState<string>('');

  const renderItem = ({item}: {item: TeamType}) => (
    <TeamSearchItem data={item} onPress={() => {}} />
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      ListEmptyComponent={
        <ListEmptyComponent text="검색된 팀이 없습니다." paddingTop={0} />
      }
      ListHeaderComponent={
        <SearchSection
          paddingHorizontal={dimension.paddingHorizontal * 0.5}
          paddingVertical={dimension.paddingVertical}
          borderColor={colors.borderTopBottomColor}>
          <SearchWrapper borderColor={colors.borderTopBottomColor}>
            <Icon name="search" color={colors.borderTopBottomColor} size={20} />
            <SearchInput
              placeholder="팀 이름을 검색해보세요."
              value={keyword}
              onChangeText={text => setKeyword(text)}
              autoFocus
            />
          </SearchWrapper>
        </SearchSection>
      }
      ItemSeparatorComponent={() => <View style={{height: 1}} />}
      stickyHeaderIndices={[0]}
    />
  );
}

export default TeamSearching;
