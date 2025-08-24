import {RestaurantDto} from './restaurant.dto';

export interface BranchDto {
  id: number;
  address: string;
  restaurant: RestaurantDto;
}
