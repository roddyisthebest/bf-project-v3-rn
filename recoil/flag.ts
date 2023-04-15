import {atom} from 'recoil';

export interface rstTeamFlagType {
  home: {
    update: {
      invitation: boolean;
      application: boolean;
      myteam: boolean;
    };
  };
}

export interface rstTweetFlagType {
  upload: boolean;
}

export const rstTeamFlag = atom<rstTeamFlagType>({
  key: 'rstTeamFlag',
  default: {
    home: {
      update: {
        invitation: false,
        application: false,
        myteam: false,
      },
    },
  },
});

export const rstTweetFlag = atom<rstTweetFlagType>({
  key: 'rstTweetFlag',
  default: {
    upload: false,
  },
});

export const rstNotificationFlag = atom<
  null | 'invitation:post' | 'application:delete' | 'application:approve'
>({
  key: 'rstNotificationFlag',
  default: null,
});
