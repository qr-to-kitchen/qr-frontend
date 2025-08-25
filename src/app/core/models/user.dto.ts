import {RestaurantDto} from './restaurant.dto';

export interface UserDto {
  id: number;
  email: string;
  username: string;
  password: string;
  role: string;
  tokenVersion: number;
  restaurant: RestaurantDto;
}
