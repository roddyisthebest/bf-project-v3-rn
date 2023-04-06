import {atom} from 'recoil';

export interface TokensObject {
  refreshToken: string;
  accessToken: string;
}

export const rstAuth = atom<boolean>({
  key: 'rstAuth',
  default: false,
});
