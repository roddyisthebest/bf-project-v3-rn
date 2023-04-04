import TeamType from './TeamType';
import UserType from './UserType';

interface InvitationType {
  id: number;
  active: boolean;
  updatedAt: Date;
  createdAt: Date;
  deletedAt: Date | null;
  User: UserType | null;
  Team: TeamType | null;
}

export default InvitationType;
