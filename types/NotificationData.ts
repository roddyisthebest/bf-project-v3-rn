import TeamType from './TeamType';

interface NotificationDataType {
  code:
    | 'invitation:post'
    | 'application:delete'
    | 'application:approve'
    | 'penalty:set'
    | null;
  team: TeamType | null;
}

export default NotificationDataType;
