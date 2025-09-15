import {UserDto} from '../../core/models/user.dto';
import {RestaurantDto} from '../../core/models/restaurant.dto';

export interface CreateRestaurantUserDto {
  restaurant: RestaurantDto;
  user: UserDto
}
