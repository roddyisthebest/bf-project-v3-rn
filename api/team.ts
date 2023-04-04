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

const updateTeam = async ({
  file,
  name,
  introducing,
  id,
}: {
  file: {name: string; type: 'multipart/form-data'; uri: string} | null;
  name: string;
  introducing: string;
  id: number;
}) => {
  const formData = new FormData();
  const accessToken = await EncryptedStorage.getItem(
    EncryptedStorageKeyList.ACCESSTOKEN,
  );

  file && formData.append('img', file);
  formData.append('name', name);
  formData.append('introducing', introducing);
  formData.append('id', id);

  return await fetch('http://192.168.123.104:3000/team', {
    method: 'PUT',
    headers: {
      Authorization: accessToken as string,
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
};

const deleteTeam = ({id}: {id: number}): Promise<AxiosResponse<response>> =>
  api.delete(`/team/${id}`);

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

const getTeam = ({id}: {id: number}): Promise<AxiosResponse<response>> =>
  api.get(`/team/${id}`);

const getTeamMates = ({
  teamId,
  lastId,
}: {
  teamId: number;
  lastId: number;
}): Promise<AxiosResponse<response>> =>
  api.get(`/team/${teamId}/mates/${lastId}`);

const setApprove = ({id}: {id: number}) =>
  api.post('/team/invitation/approve', {id});

export {
  addTeam,
  getTeam,
  updateTeam,
  addInvitation,
  getInvitaions,
  deleteInvitation,
  deleteTeam,
  getTeamMates,
  setApprove,
};
