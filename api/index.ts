import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
export const api = axios.create({
  baseURL: 'http://192.168.123.107:3000' as string,
});

export async function setTokenToAxios() {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  console.log(accessToken, 'axiosToken');
  api.defaults.headers.common.Authorization = accessToken;

  return new Promise(function (resolve, _) {
    resolve('ok');
  });
}
export type response = {
  payload: any;
  code: string;
  msg: string;
};
