import {atom} from 'recoil';
import TeamType from '../types/TeamType';
import UserType from '../types/UserType';
export interface rstMyInfoType {
  user: UserType | null;
  team: TeamType | null;
}

export const rstMyInfo = atom<rstMyInfoType>({
  key: 'rstMyInfo',
  default: {
    user: null,
    team: null,
  },
});
