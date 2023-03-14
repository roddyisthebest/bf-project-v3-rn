import {atom} from 'recoil';

export interface TokensObject {
  refreshToken: string;
  accessToken: string;
}

export const tokens = atom<TokensObject>({
  key: 'tokenAuthObject',
  default: {
    refreshToken: '',
    accessToken: '',
  },
});

export const isLoggedIn = atom<boolean>({
  key: 'isLoggedIn',
  default: false,
});
