import {AxiosResponse} from 'axios';
import {api, response} from './index';

const getPrays = (
  lastId: number,
  teamId: number,
  weekend: string,
): Promise<AxiosResponse<response>> =>
  api.get(`/pray/${lastId}/team/${teamId}/weekend/${weekend}`);

const addPray = (
  teamId: number,
  userId: number,
): Promise<AxiosResponse<response>> => api.post('/pray', {teamId, userId});

const updatePray = (
  id: number,
  content: string,
  teamId: number,
): Promise<AxiosResponse<response>> =>
  api.patch('/pray', {id, content, teamId});

const deletePray = (
  id: number,
  teamId: number,
): Promise<AxiosResponse<response>> => api.delete(`/pray/${id}/team/${teamId}`);

export {getPrays, addPray, updatePray, deletePray};
