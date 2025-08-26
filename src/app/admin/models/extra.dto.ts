import {RestaurantDto} from '../../core/models/restaurant.dto';

export interface ExtraDto {
  id: number;
  name: string;
  restaurant: RestaurantDto;
  restaurantId: number;
}
