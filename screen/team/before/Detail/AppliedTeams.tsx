import {FlatList, ActivityIndicator, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../../recoil/user';
import {LoadingContainer} from '../../../../components/basic/View';
import styled from 'styled-components/native';
import {colors} from '../../../../styles/color';
import ListEmptyComponent from '../../../../components/parts/tabs/ListEmptyComponent';
import TeamApplyItem from '../../../../components/parts/detail/TeamApplyItem';
import InvitationType from '../../../../types/InvitationType';
import {getMyApplications} from '../../../../api/user';
const ModifiedLoadingContainer = styled(LoadingContainer)`
  justify-content: flex-start;
  padding-top: 20px;
`;

function AppliedTeams() {
  const {team} = useRecoilValue(rstMyInfo);

  const [data, setData] = useState<InvitationType[]>([]);
  const [lastId, setLastId] = useState<number>(-1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  const getData = useCallback(
    async (id: number) => {
      try {
        const {
          data: {payload, code},
        }: {data: {payload: InvitationType[]; code: string}} =
          await getMyApplications({
            lastId: id,
          });

        console.log(payload);
        if (code === 'OK:LAST') {
          setDisabled(true);
        }
        if (id === -1) {
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
    },
    [team],
  );

  const handleRefresh = useCallback(
    async (id: number) => {
      try {
        setDisabled(false);
        setRefreshing(true);
        if (id === -1) {
          const {
            data: {payload, code},
          }: {data: {payload: InvitationType[]; code: string}} =
            await getMyApplications({
              lastId: id,
            });
          setData(payload);
          if (code === 'OK:LAST') {
            setDisabled(true);
          }
        } else {
          setLastId(-1);
        }
      } catch (e) {
      } finally {
        setRefreshing(false);
      }
    },
    [team],
  );

  const renderItem = ({item}: {item: InvitationType}) => (
    <TeamApplyItem
      data={item}
      onPress={(id: number) => {
        console.log(id);
      }}
    />
  );

  useEffect(() => {
    if (!disabled) {
      getData(lastId);
    }
  }, [disabled, getData, lastId]);

  return loading ? (
    <ModifiedLoadingContainer>
      <ActivityIndicator color={colors.loadingIconColor} size={25} />
    </ModifiedLoadingContainer>
  ) : (
    <FlatList
      data={data}
      refreshing={refreshing}
      renderItem={renderItem}
      onRefresh={() => handleRefresh(lastId)}
      keyExtractor={item => item.id.toString()}
      onEndReached={() => {
        if (data.length !== 0) {
          setLastId(data[data.length - 1].id);
        }
      }}
      ListEmptyComponent={
        <ListEmptyComponent text="가입신청한 팀이 없습니다." paddingTop={20} />
      }
      ItemSeparatorComponent={() => <View style={{height: 1}} />}
    />
  );
}

export default AppliedTeams;
