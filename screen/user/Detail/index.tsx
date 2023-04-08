import {FlatList, View} from 'react-native';
import React from 'react';
import Layout from '../../../components/layout';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../../navigation/Root';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../recoil/user';
import {GapRowView} from '../../../components/basic/View';
import DetailHeader from '../../../components/container/DetailHeader';
import UserType from '../../../types/UserType';
import {ButtonText, SmButton} from '../../../components/basic/Button';
import {colors} from '../../../styles/color';
import Icon from 'react-native-vector-icons/Ionicons';

import NavItem from '../../../components/parts/detail/NavItem';
function Detail() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const {user} = useRecoilValue(rstMyInfo);

  const data = [
    {
      id: 1,
      text: '매일성경',
      onPress: () => {
        navigation.navigate('User', {screen: 'Tweet'});
      },
    },
    {
      id: 2,
      text: '기도제목',
      onPress: () => {
        navigation.navigate('User', {screen: 'Pray'});
      },
    },
    {
      id: 3,
      text: '벌금',
      onPress: () => {
        navigation.navigate('User', {screen: 'Penalty'});
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
          data={user as UserType}
          type="user"
          ButtonComponent={() => (
            <SmButton
              bkg={colors.settingButtonBkgColor}
              radius={10}
              onPress={() => navigation.navigate('User', {screen: 'Setting'})}>
              <Icon
                name="settings"
                color={colors.settingButtonTextColor}
                size={14}
              />

              <ButtonText
                color={colors.settingButtonTextColor}
                fontSize={12.5}
                fontWeight={400}>
                설정
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
