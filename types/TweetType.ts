import UserType from './UserType';

export type TweetType = {
  id: number;
  img: string;
  content: string;
  User: UserType;
  createdAt: string | Date;
  updatedAt: string | Date;
};
