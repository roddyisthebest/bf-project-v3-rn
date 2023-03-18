import {atom} from 'recoil';

export interface myInfoType {
  name: string;
  oauth: 'naver' | 'kakao' | 'apple' | 'local' | 'none';
  team: {} | null;
}

export const myInfo = atom<myInfoType>({
  key: 'myInfo',
  default: {
    name: '',
    oauth: 'none',
    team: null,
  },
});
