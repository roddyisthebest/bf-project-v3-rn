import {AxiosResponse} from 'axios';
import {api, response} from './index';

const getPenaltys = (
  lastId: number,
  teamId: number,
): Promise<AxiosResponse<response>> =>
  api.get(`/penalty/${lastId}/team/${teamId}`);

const updatePaper = ({
  id,
  teamId,
  paper,
}: {
  id: number;
  teamId: number;
  paper: number;
}): Promise<AxiosResponse<response>> =>
  api.patch('/penalty', {id, teamId, paper});

export {getPenaltys, updatePaper};
