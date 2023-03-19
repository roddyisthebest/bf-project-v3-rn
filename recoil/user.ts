import {atom} from 'recoil';
import TeamType from '../types/TeamType';

export interface myInfoType {
  name: string;
  oauth: 'naver' | 'kakao' | 'apple' | 'local' | 'none';
  team: TeamType | null;
}

export const myInfo = atom<myInfoType>({
  key: 'myInfo',
  default: {
    name: '',
    oauth: 'none',
    team: null,
  },
});
