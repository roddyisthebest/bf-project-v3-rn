import {AxiosResponse} from 'axios';
import {api, response} from './index';

const snsLogin = ({
  uid,
  name,
  img,
  oauth,
}: {
  uid: string;
  name: string;
  img: string | null;
  oauth: 'naver' | 'kakao' | 'apple';
}): Promise<AxiosResponse<response>> =>
  api.post('/user/login/sns', {uid, name, img, oauth});

const adminLogin = ({
  uid,
  password,
}: {
  uid: string;
  password: string;
}): Promise<AxiosResponse<response>> =>
  api.post('/user/signin', {uid, password});

const getMyTeams = (): Promise<AxiosResponse<response>> =>
  api.get('/user/myTeams');

const getService = ({
  teamId,
}: {
  teamId: number;
}): Promise<AxiosResponse<response>> => api.get(`/user/service/team/${teamId}`);

const addService = ({
  tweet,
  pray,
  penalty,
  teamId,
}: {
  tweet: boolean;
  pray: boolean;
  penalty: boolean;
  teamId: number;
}): Promise<AxiosResponse<response>> =>
  api.post('/user/service', {tweet, pray, penalty, teamId});

const updateService = ({
  tweet,
  pray,
  penalty,
  teamId,
}: {
  tweet: boolean;
  pray: boolean;
  penalty: boolean;
  teamId: number;
}): Promise<AxiosResponse<response>> =>
  api.put('/user/service', {tweet, pray, penalty, teamId});

const updatePayed = (
  id: number,
  payed: boolean,
): Promise<AxiosResponse<response>> => api.patch('/user/paycheck', {id, payed});

export {
  snsLogin,
  adminLogin,
  getMyTeams,
  getService,
  addService,
  updateService,
  updatePayed,
};
