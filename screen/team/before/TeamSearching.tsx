import React from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../../navigation/Root';
import Layout from '../../../components/layout';

function TeamSearching() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  return <Layout scrollable={false} isItWhite={true} />;
}

export default TeamSearching;
