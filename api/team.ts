import {AxiosResponse} from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {EncryptedStorageKeyList} from '../navigation/Root';
import {api, response} from './index';

const addTeam = async ({
  file,
  name,
  introducing,
}: {
  file: {name: string; type: 'multipart/form-data'; uri: string};
  name: string;
  introducing: string;
}) => {
  const formData = new FormData();
  const accessToken = await EncryptedStorage.getItem(
    EncryptedStorageKeyList.ACCESSTOKEN,
  );

  formData.append('img', file);
  formData.append('name', name);
  formData.append('introducing', introducing);

  return await fetch('http://192.168.123.104:3000/team', {
    method: 'POST',
    headers: {
      Authorization: accessToken as string,

      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
};

const addInvitation = async ({
  userId,
  teamId,
}: {
  userId: number;
  teamId: number;
}): Promise<AxiosResponse<response>> =>
  api.post('/team/invitation', {userId, teamId});

const getInvitaions = async ({
  teamId,
  lastId,
}: {
  teamId: number;
  lastId: number;
}): Promise<AxiosResponse<response>> =>
  api.get(`/team/${teamId}/invitation/${lastId}`);

const deleteInvitation = async ({
  id,
}: {
  id: number;
}): Promise<AxiosResponse<response>> => api.delete(`/team/invitation/${id}`);

export {addTeam, addInvitation, getInvitaions, deleteInvitation};
