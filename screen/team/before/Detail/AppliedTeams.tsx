import {FlatList, ActivityIndicator, View, Alert} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {rstMyInfo} from '../../../../recoil/user';
import {LoadingContainer} from '../../../../components/basic/View';
import styled from 'styled-components/native';
import {colors} from '../../../../styles/color';
import ListEmptyComponent from '../../../../components/parts/tabs/ListEmptyComponent';
import TeamApplyItem from '../../../../components/parts/detail/TeamApplyItem';
import InvitationType from '../../../../types/InvitationType';
import {getMyApplications} from '../../../../api/user';
import {deleteApplication} from '../../../../api/team';
import {rstTeamFlag} from '../../../../recoil/flag';
const ModifiedLoadingContainer = styled(LoadingContainer)`
  justify-content: flex-start;
  padding-top: 20px;
`;

function AppliedTeams() {
  const {team} = useRecoilValue(rstMyInfo);
  const setFlag = useSetRecoilState(rstTeamFlag);

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

  const onPress = useCallback(
    (id: number) => {
      Alert.alert('가입신청 취소', '정말 가입 신청을 취소하시겠습니까?', [
        {
          text: '취소',
          onPress: () => {},
          style: 'default',
        },
        {
          text: '가입신청 취소',
          onPress: async () => {
            await deleteApplication({id, teamId: team?.id as number});
            setData(prev => prev?.filter(pray => pray.id !== id));
            setFlag(prev => ({
              home: {
                update: {
                  application: true,
                  invitation: prev.home.update.invitation,
                  myteam: prev.home.update.myteam,
                },
              },
            }));
            Alert.alert('가입신청이 취소 되었습니다.');
          },
          style: 'destructive',
        },
      ]);
    },
    [team],
  );

  const renderItem = ({item}: {item: InvitationType}) => (
    <TeamApplyItem data={item} onPress={onPress} />
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
