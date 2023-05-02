import {AxiosResponse} from 'axios';
import {api, response} from './index';

const addReport = (
  content: string,
  model: string,
): Promise<AxiosResponse<response>> => api.post('/report', {content, model});

export {addReport};
