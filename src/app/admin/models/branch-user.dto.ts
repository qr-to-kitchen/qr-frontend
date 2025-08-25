import {BranchDto} from '../../core/models/branch.dto';
import {UserDto} from '../../core/models/user.dto';

export interface BranchUserDto {
  branch: BranchDto;
  user: UserDto
}
