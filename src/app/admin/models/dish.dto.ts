import {RestaurantDto} from '../../core/models/restaurant.dto';
import {CategoryDto} from './category.dto';

export interface DishDto {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  restaurant: RestaurantDto;
  category: CategoryDto;
  restaurantId: number;
  categoryId: number;
  imageUrl: string;
}
