import {atom} from 'recoil';

export const addTeamFlag = atom<boolean>({
  key: 'addTeam',
  default: false,
});
