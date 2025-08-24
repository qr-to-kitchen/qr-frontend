import {RestaurantDto} from '../restaurant.dto';

export interface RestaurantApiResponse {
  restaurant: RestaurantDto;
  restaurants: RestaurantDto[];
}
