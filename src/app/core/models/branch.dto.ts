import {RestaurantDto} from './restaurant.dto';

export interface BranchDto {
  id: number;
  address: string;
  dailyCode: string;
  dailyCodeUpdatedAt: Date;
  restaurant: RestaurantDto;
}
