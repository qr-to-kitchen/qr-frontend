import {BranchDishDto} from '../branch-dish.dto';
import {DishDto} from '../dish.dto';

export interface BranchDishApiResponse {
  branchDish: BranchDishDto;
  branchesDishes: BranchDishDto[];

  dishes: DishDto[];
}
