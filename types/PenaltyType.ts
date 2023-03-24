import UserType from './UserType';

interface PenaltyType {
  id: number;
  paper: number;
  payed: boolean;
  weekend: string;
  User: UserType | {};
}
export default PenaltyType;
