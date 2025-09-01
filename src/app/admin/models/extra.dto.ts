import {RestaurantDto} from '../../core/models/restaurant.dto';
import {ExtraBranchDto} from './extra-branch.dto';

export interface ExtraDto {
  id: number;
  name: string;
  basePrice: number;
  restaurant: RestaurantDto;
  extraBranch: ExtraBranchDto[];
  restaurantId: number;
}
