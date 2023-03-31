import {FlatList, View} from 'react-native';
import React from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../navigation/Root';
import Layout from '../../components/layout';
import {GapRowView} from '../../components/basic/View';
import DetailHeader from '../../components/container/DetailHeader';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../recoil/user';
import TeamType from '../../types/TeamType';
import {ButtonText, SmButton} from '../../components/basic/Button';
import {colors} from '../../styles/color';
import NavItem from '../../components/parts/detail/NavItem';
function Detail() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const {team} = useRecoilValue(rstMyInfo);

  const data = [
    {
      id: 1,
      text: '팀원설정',
      onPress: () => {
        navigation.navigate('Team', {screen: 'UserSetting'});
      },
    },
  ];

  const renderItem = ({item}: {item: {text: string; onPress: () => void}}) => (
    <NavItem text={item.text} onPress={item.onPress} />
  );

  return (
    <Layout scrollable={false} isItWhite={false}>
      <GapRowView
        gap={15}
        marginTop={0}
        marginBottom={0}
        paddingHorizontal={0}
        paddingVertical={0}>
        <DetailHeader
          data={team as TeamType}
          type="team"
          ButtonComponent={() => (
            <SmButton bkg={colors.prayButtonDeleteBkgColor} radius={10}>
              <ButtonText
                color={colors.prayButtonDeleteTextColor}
                fontSize={12.5}
                fontWeight={400}>
                삭제하기
              </ButtonText>
            </SmButton>
          )}
        />
        <FlatList
          scrollEnabled={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={() => (
            <View style={{height: 1, backgroundColor: '#F3F3F3'}} />
          )}
          ListFooterComponent={() => (
            <View
              style={{height: 1, backgroundColor: colors.borderTopBottomColor}}
            />
          )}
        />
      </GapRowView>
    </Layout>
  );
}

export default Detail;
