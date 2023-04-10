import {atom} from 'recoil';
import {thisSunday} from '../util/Date';
export interface rstStoreType {
  weekend: string | null;
}

export const rstStore = atom<rstStoreType>({
  key: 'rstStore',
  default: {
    weekend: thisSunday(0),
  },
});
