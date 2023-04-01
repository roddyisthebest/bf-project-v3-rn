import {atom} from 'recoil';

export const updateTeamFlag = atom<boolean>({
  key: 'updateTeam',
  default: false,
});

export const addTweetFlag = atom<boolean>({
  key: 'addTweet',
  default: false,
});
