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

const addApplication = async ({
  teamId,
}: {
  teamId: number;
}): Promise<AxiosResponse<response>> => api.post('/team/application', {teamId});

const getInvitaions = async ({
  teamId,
  lastId,
}: {
  teamId: number;
  lastId: number;
}): Promise<AxiosResponse<response>> =>
  api.get(`/team/${teamId}/invitation/${lastId}`);

const getApplications = async ({
  teamId,
  lastId,
}: {
  teamId: number;
  lastId: number;
}): Promise<AxiosResponse<response>> =>
  api.get(`/team/${teamId}/application/${lastId}`);

const getService = ({
  teamId,
}: {
  teamId: number;
}): Promise<AxiosResponse<response>> => api.get(`/team/${teamId}/service`);

const updateService = ({
  tweet,
  pray,
  penalty,
  id,
  teamId,
}: {
  tweet: boolean;
  pray: boolean;
  penalty: boolean;
  id: number;
  teamId: number;
}): Promise<AxiosResponse<response>> =>
  api.put(`/team/${teamId}/service`, {tweet, pray, penalty, id});

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

const setApproveInvitation = ({
  id,
}: {
  id: number;
}): Promise<AxiosResponse<response>> =>
  api.post('/team/invitation/approve', {id});

const setApproveApplication = ({
  id,
  teamId,
}: {
  id: number;
  teamId: number;
}): Promise<AxiosResponse<response>> =>
  api.post('/team/application/approve', {id, teamId});

const dropout = ({
  teamId,
  userId,
}: {
  teamId: number;
  userId: number;
}): Promise<AxiosResponse<response>> =>
  api.delete(`/team/${teamId}/dropout/${userId}`);

const withdraw = ({
  teamId,
}: {
  teamId: number;
}): Promise<AxiosResponse<response>> => api.delete(`/team/${teamId}/withdraw`);

export {
  addTeam,
  getTeam,
  updateTeam,
  addInvitation,
  getService,
  updateService,
  getInvitaions,
  getApplications,
  deleteInvitation,
  deleteTeam,
  getTeamMates,
  setApproveInvitation,
  setApproveApplication,
  addApplication,
  dropout,
  withdraw,
};
