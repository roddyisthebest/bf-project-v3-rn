interface UserType {
  id: number;
  img: string;
  name: string;
  oauth: 'local' | 'kakao' | 'naver' | 'apple';
  password: null;
  phoneToken: string | null;
  uid: string;
  updatedAt: Date;
  createdAt: Date;
  deletedAt: Date | null;
}

export default UserType;
