import {RestaurantDto} from '../../core/models/restaurant.dto';

export interface CategoryDto {
  id: number;
  name: string;
  displayOrder: number;
  restaurant: RestaurantDto;
  restaurantId: number;
}
