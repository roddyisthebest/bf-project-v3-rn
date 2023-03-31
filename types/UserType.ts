import PenaltyType from './PenaltyType';
import PrayType from './PrayType';

interface UserType {
  id: number;
  img: string;
  name: string;
  oauth: 'local' | 'kakao' | 'naver' | 'apple';
  password: null;
  phoneToken: string | null;
  uid: string;
  Prays: PrayType[] | null;
  updatedAt: Date;
  createdAt: Date;
  deletedAt: Date | null;
  Penalties: PenaltyType[] | null;
}

export default UserType;
