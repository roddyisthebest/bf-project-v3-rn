import {AxiosResponse} from 'axios';
import {api, response} from './index';

const loginWithKakao = ({
  id,
  name,
  img,
}: {
  id: string;
  name: string;
  img: string;
}): Promise<AxiosResponse<response>> =>
  api.post('/user/login/kakao', {id, name, img});

export {loginWithKakao};
