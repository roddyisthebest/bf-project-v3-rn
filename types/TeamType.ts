interface TeamType {
  bossId: number;
  createdAt: Date;
  deletedAt: Date;
  id: number;
  img: string;
  introducing: string;
  name: string;
  updatedAt: Date;
  userteam: [Object] | null;
}

export default TeamType;
