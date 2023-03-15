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

export {snsLogin, adminLogin};
