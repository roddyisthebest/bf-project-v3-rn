import {atom} from 'recoil';

export interface TokensObject {
  refreshToken: string;
  accessToken: string;
}

export const isLoggedIn = atom<boolean>({
  key: 'isLoggedIn',
  default: false,
});
