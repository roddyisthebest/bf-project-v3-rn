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

export {snsLogin};
