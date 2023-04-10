import {atom} from 'recoil';

export interface rstStoreType {
  weekend: string | null;
}

export const rstStore = atom<rstStoreType>({
  key: 'rstStore',
  default: {
    weekend: null,
  },
});
