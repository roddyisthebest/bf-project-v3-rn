import {FlatList, ActivityIndicator, View} from 'react-native';
import React, {useState} from 'react';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../../recoil/user';
import {LoadingContainer} from '../../../../components/basic/View';
import styled from 'styled-components/native';
import {colors} from '../../../../styles/color';
import ListEmptyComponent from '../../../../components/parts/tabs/ListEmptyComponent';
import TeamType from '../../../../types/TeamType';
import TeamApplyItem from '../../../../components/parts/detail/TeamApplyItem';

const ModifiedLoadingContainer = styled(LoadingContainer)`
  justify-content: flex-start;
  padding-top: 20px;
`;

function AppliedTeams() {
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
  const [lastId, setLastId] = useState<number>(-1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  const renderItem = ({item}: {item: TeamType}) => (
    <TeamApplyItem data={item} onPress={() => {}} />
  );

  return loading ? (
    <ModifiedLoadingContainer>
      <ActivityIndicator color={colors.loadingIconColor} size={25} />
    </ModifiedLoadingContainer>
  ) : (
    <FlatList
      data={data}
      refreshing={refreshing}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      onEndReached={() => {
        if (data.length !== 0) {
          setLastId(data[data.length - 1].id);
        }
      }}
      ListEmptyComponent={
        <ListEmptyComponent text="가입한 팀이 없습니다." paddingTop={20} />
      }
      ItemSeparatorComponent={() => <View style={{height: 1}} />}
    />
  );
}

export default AppliedTeams;
