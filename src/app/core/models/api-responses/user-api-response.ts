import {UserDto} from '../user.dto';

export interface UserApiResponse {
  user: UserDto;
  users: UserDto[];
}
