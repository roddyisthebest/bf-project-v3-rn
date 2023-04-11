import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {EncryptedStorageKeyList} from '../navigation/Root';
export const api = axios.create({
  baseURL: 'http://192.168.123.104:3000' as string,
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
