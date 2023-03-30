import {AxiosResponse} from 'axios';
import {api, response} from './index';

const getPenaltys = (
  lastId: number,
  teamId: number,
): Promise<AxiosResponse<response>> =>
  api.get(`/penalty/${lastId}/team/${teamId}`);

export {getPenaltys};
