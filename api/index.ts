import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {EncryptedStorageKeyList} from '../navigation/Root';
import Config from 'react-native-config';
export const api = axios.create({
  baseURL: Config.API_URL as string,
});

export async function setTokenToAxios() {
  const accessToken = await EncryptedStorage.getItem(
    EncryptedStorageKeyList.ACCESSTOKEN,
  );
  console.log(accessToken, 'axiosTokenToAxios');
  api.defaults.headers.common.Authorization = accessToken;

  return new Promise(function (resolve, _) {
    resolve('ok');
  });
}
export type response = {
  payload: any;
  code: string;
  message: string;
};
