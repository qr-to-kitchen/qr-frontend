import {RestaurantDto} from '../../core/models/restaurant.dto';

export interface DishDto {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  restaurant: RestaurantDto;
  restaurantId: number;
  imageUrl: string;
}
