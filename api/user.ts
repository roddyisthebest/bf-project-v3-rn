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

const getMyTweets = ({
  teamId,
  lastId = -1,
}: {
  teamId: number;
  lastId: number;
}): Promise<AxiosResponse<response>> =>
  api.get(`/user/team/${teamId}/tweets/${lastId}`);

const getMyPrays = ({
  teamId,
  lastId = -1,
}: {
  teamId: number;
  lastId: number;
}): Promise<AxiosResponse<response>> =>
  api.get(`/user/team/${teamId}/prays/${lastId}`);

const getMyPenaltys = ({
  teamId,
  lastId = -1,
}: {
  teamId: number;
  lastId: number;
}): Promise<AxiosResponse<response>> =>
  api.get(`/user/team/${teamId}/penaltys/${lastId}`);

const getMyTeams = ({
  lastId,
}: {
  lastId: number;
}): Promise<AxiosResponse<response>> => api.get(`/user/team/lastId/${lastId}`);

const getMyThumbTeams = (): Promise<AxiosResponse<response>> =>
  api.get('/user/team/thumbnail');

const getMyThumbInvitations = ({
  active,
}: {
  active: boolean;
}): Promise<AxiosResponse<response>> =>
  api.get(`/user/invitation/thumbnail/${active}`);

const getMyInvitations = ({
  lastId,
}: {
  lastId: number;
}): Promise<AxiosResponse<response>> => api.get(`/user/invitation/${lastId}`);

const getMyApplications = ({
  lastId,
}: {
  lastId: number;
}): Promise<AxiosResponse<response>> => api.get(`/user/application/${lastId}`);

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

const updatePayed = (
  id: number,
  payed: boolean,
): Promise<AxiosResponse<response>> => api.patch('/user/paycheck', {id, payed});

export {
  snsLogin,
  adminLogin,
  getMyTeams,
  getService,
  getMyTweets,
  getMyPrays,
  getMyPenaltys,
  addService,
  updatePayed,
  getMyInvitations,
  getMyApplications,
  getMyThumbTeams,
  getMyThumbInvitations,
};
