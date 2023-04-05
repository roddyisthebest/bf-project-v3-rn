import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {colors} from '../../../../styles/color';
import Icon from 'react-native-vector-icons/Ionicons';
import {FlatList, View, ActivityIndicator} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../../../navigation/Root';

import TeamSearchItem from '../../../../components/parts/detail/TeamSearchItem';
import ListEmptyComponent from '../../../../components/parts/tabs/ListEmptyComponent';
import dimension from '../../../../styles/dimension';

import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../../recoil/user';
import TeamType from '../../../../types/TeamType';
import {getTeams} from '../../../../api/search';
import {SmButton} from '../../../../components/basic/Button';
import {LoadingContainer} from '../../../../components/basic/View';

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

const ModifiedButton = styled(SmButton)`
  width: 32.5px;
  height: 32.5px;
  padding: 0;
`;

const ModifiedLoadingContainer = styled(LoadingContainer)`
  justify-content: flex-start;
  padding-top: 20px;
`;
function TeamSearching() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const {team} = useRecoilValue(rstMyInfo);
  const [data, setData] = useState<TeamType[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [lastId, setLastId] = useState<number>(-1);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleRefresh = useCallback(
    async (searchMode: boolean) => {
      try {
        setDisabled(false);
        setRefreshing(true);
        if (lastId === -1) {
          const {
            data: {payload, code},
          }: {data: {payload: TeamType[]; code: string}} = await getTeams(
            '',
            lastId,
          );
          setData(payload);
          if (code === 'OK:LAST') {
            setDisabled(true);
          }
        } else {
          if (!searchMode) {
            setKeyword('');
          }
          setLastId(-1);
        }
      } catch (e) {
      } finally {
        setRefreshing(false);
      }
    },
    [lastId],
  );

  const getData = useCallback(async () => {
    try {
      const {
        data: {payload, code},
      }: {data: {payload: TeamType[]; code: string}} = await getTeams(
        keyword,
        lastId,
      );
      console.log(payload);
      if (code === 'OK:LAST') {
        setDisabled(true);
      }
      if (lastId === -1) {
        setData(payload);
      } else {
        setData(prev => [...prev, ...payload]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      if (loading) {
        setLoading(false);
      }
    }
  }, [team, keyword, lastId, loading]);

  const renderItem = ({item}: {item: TeamType}) => (
    <TeamSearchItem data={item} />
  );

  useEffect(() => {
    if (!disabled) {
      getData();
    }
  }, [lastId, disabled]);

  return loading ? (
    <ModifiedLoadingContainer>
      <ActivityIndicator color={colors.loadingIconColor} size={25} />
    </ModifiedLoadingContainer>
  ) : (
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
            <SearchInput
              placeholder="팀 이름을 검색해보세요."
              value={keyword}
              onChangeText={text => setKeyword(text)}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={() => handleRefresh(true)}
            />
            <ModifiedButton
              bkg={colors.settingButtonBkgColor}
              radius={32.5}
              onPress={() => handleRefresh(true)}>
              <Icon
                name="search"
                color={colors.settingButtonTextColor}
                size={18}
              />
            </ModifiedButton>
          </SearchWrapper>
        </SearchSection>
      }
      ItemSeparatorComponent={() => <View style={{height: 2}} />}
      stickyHeaderIndices={[0]}
      onEndReached={() => {
        if (data.length !== 0) {
          console.log(data[data.length - 1].id);
          setLastId(data[data.length - 1].id);
        }
      }}
      onRefresh={() => handleRefresh(false)}
      refreshing={refreshing}
    />
  );
}

export default TeamSearching;
