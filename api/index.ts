import axios from 'axios';
export const api = axios.create({
  baseURL: 'http://192.168.123.107:3000' as string,
});
export type response = {
  payload: any;
  code: string;
  msg: string;
};
