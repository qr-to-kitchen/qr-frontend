import {RestaurantDto} from '../../core/models/restaurant.dto';

export interface ExtraDto {
  id: number;
  name: string;
  basePrice: number;
  restaurant: RestaurantDto;
  restaurantId: number;
}
