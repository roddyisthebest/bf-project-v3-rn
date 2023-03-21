import {atom} from 'recoil';
import TeamType from '../types/TeamType';
import UserType from '../types/UserType';
export interface myInfoType {
  user: UserType | null;
  team: TeamType | null;
}

export const rstMyInfo = atom<myInfoType>({
  key: 'myInfo',
  default: {
    user: null,
    team: null,
  },
});
