import {atom} from 'recoil';

export const addTeamFlag = atom<boolean>({
  key: 'addTeam',
  default: false,
});

export const addTweetFlag = atom<boolean>({
  key: 'addTweet',
  default: false,
});
