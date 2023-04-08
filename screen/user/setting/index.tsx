import {FlatList, View} from 'react-native';
import React from 'react';
import Layout from '../../../components/layout';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../../navigation/Root';

import {colors} from '../../../styles/color';

import NavItem from '../../../components/parts/detail/NavItem';
function Setting() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const data = [
    {
      id: 1,
      text: '사용기능 수정',
      onPress: () => {
        navigation.navigate('User', {screen: 'Service'});
      },
    },
  ];

  const renderItem = ({item}: {item: {text: string; onPress: () => void}}) => (
    <NavItem text={item.text} onPress={item.onPress} />
  );

  return (
    <Layout scrollable={false} isItWhite={false}>
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
    </Layout>
  );
}

export default Setting;
