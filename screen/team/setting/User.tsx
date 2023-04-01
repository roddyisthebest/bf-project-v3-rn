import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {colors} from '../../../styles/color';
import Icon from 'react-native-vector-icons/Ionicons';
import {Alert, FlatList} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../../navigation/Root';
import UserType from '../../../types/UserType';
import UserSearchItem from '../../../components/parts/detail/UserSearchItem';
import ListEmptyComponent from '../../../components/parts/tabs/ListEmptyComponent';
import dimension from '../../../styles/dimension';
import {getUsers} from '../../../api/user';
import {addInvitation} from '../../../api/team';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../recoil/user';
import {AxiosError} from 'axios';

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

function User() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const {team} = useRecoilValue(rstMyInfo);

  const [data, setData] = useState<UserType[]>([]);
  const [keyword, setKeyword] = useState<string>('');

  const invite = async (id: number) => {
    try {
      const res = await addInvitation({userId: id, teamId: team?.id as number});
      Alert.alert(res.data.payload.message);
    } catch (error) {
      const {response} = error as unknown as AxiosError;
      if (response?.status === 409) {
        Alert.alert('이미 초대된 회원입니다.');
      }
    } finally {
      setData([]);
      setKeyword('');
    }
  };

  const getData = useCallback(async () => {
    try {
      const res = await getUsers(keyword);
      setData(res.data.payload);
    } catch (e) {
      console.log(e);
    }
  }, [keyword]);

  const renderItem = ({item}: {item: UserType}) => (
    <UserSearchItem data={item} onPress={invite} />
  );

  useEffect(() => {
    if (keyword.length !== 0) {
      getData();
    }
  }, [keyword]);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      ListEmptyComponent={
        <ListEmptyComponent text="검색된 유저가 없습니다." paddingTop={0} />
      }
      ListHeaderComponent={
        <SearchSection
          paddingHorizontal={dimension.paddingHorizontal * 0.5}
          paddingVertical={dimension.paddingVertical}
          borderColor={colors.borderTopBottomColor}>
          <SearchWrapper borderColor={colors.borderTopBottomColor}>
            <Icon name="search" color={colors.borderTopBottomColor} size={20} />
            <SearchInput
              placeholder="유저이름을 입력해보세요."
              value={keyword}
              onChangeText={text => setKeyword(text)}
              autoFocus
            />
          </SearchWrapper>
        </SearchSection>
      }
      stickyHeaderIndices={[0]}
    />
  );
}

export default User;
