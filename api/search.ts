import {AxiosResponse} from 'axios';
import {api, response} from './index';

const getUsers = (keyword: string): Promise<AxiosResponse<response>> =>
  api.get(`/search/users/${keyword}`);

const getTeams = (
  keyword: string,
  lastId: number,
): Promise<AxiosResponse<response>> => {
  let filteredKeyword = 'no-data';

  if (keyword.length !== 0) {
    filteredKeyword = keyword;
  }
  return api.get(`/search/teams/${filteredKeyword}/${lastId}`);
};

export {getUsers, getTeams};
