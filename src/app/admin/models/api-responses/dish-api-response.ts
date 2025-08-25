import {DishDto} from '../dish.dto';

export interface DishApiResponse {
  dish: DishDto;
  dishes: DishDto[];
}
