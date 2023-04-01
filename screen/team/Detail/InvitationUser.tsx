import {FlatList} from 'react-native';
import React, {useState} from 'react';
import UserType from '../../../types/UserType';
import UserInvitationItem from '../../../components/parts/detail/UserInvitationItem';

function InvitationUser() {
  const date = new Date();

  const [data, setData] = useState<UserType[]>([]);

  const renderItem = ({item}: {item: UserType}) => (
    <UserInvitationItem data={item} />
  );
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
    />
  );
}

export default InvitationUser;
