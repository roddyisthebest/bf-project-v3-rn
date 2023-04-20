import NtCodeType from './NtCodeType';
import TeamType from './TeamType';

interface NtDataType {
  code: NtCodeType | null;
  team: TeamType | null;
}

export default NtDataType;
