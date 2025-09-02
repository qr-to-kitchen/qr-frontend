import {RestaurantDto} from '../../core/models/restaurant.dto';
import {DishDto} from './dish.dto';

export interface CategoryDto {
  id: number;
  name: string;
  displayOrder: number;
  visible: boolean;
  restaurant: RestaurantDto;
  dishes: DishDto[];
  restaurantId: number;
}
