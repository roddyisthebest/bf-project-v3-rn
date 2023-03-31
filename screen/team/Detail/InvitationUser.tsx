import {FlatList} from 'react-native';
import React, {useState} from 'react';
import UserType from '../../../types/UserType';
import UserInvitationItem from '../../../components/parts/detail/UserInvitationItem';

function InvitationUser() {
  const date = new Date();

  const [data, setData] = useState<UserType[]>([
    {
      id: 1,
      img: 'https://i.imgur.com/ytPpUOF.gif',
      name: '배성연',
      oauth: 'local',
      password: null,
      phoneToken: null,
      uid: '',
      Prays: null,
      updatedAt: date,
      createdAt: date,
      deletedAt: null,
      Penalties: null,
    },
  ]);

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
