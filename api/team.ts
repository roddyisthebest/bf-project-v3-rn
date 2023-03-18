import {AxiosResponse} from 'axios';
import {api, response} from './index';

const addTeam = ({
  file,
  name,
  introducing,
}: {
  file: {name: string; type: 'image/jpg' | 'image/jpeg'; uri: string};
  name: string;
  introducing: string;
}): Promise<AxiosResponse<response>> => {
  const formData = new FormData();

  formData.append('img', file);
  formData.append('name', name);
  formData.append('introducing', introducing);

  return api.post('/team', formData);
};

export {addTeam};
