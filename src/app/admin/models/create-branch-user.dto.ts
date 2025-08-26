import {BranchDto} from '../../core/models/branch.dto';
import {UserDto} from '../../core/models/user.dto';

export interface CreateBranchUserDto {
  branch: BranchDto;
  user: UserDto
}
