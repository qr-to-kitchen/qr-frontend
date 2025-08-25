import {BranchDishDto} from '../branch-dish.dto';

export interface BranchDishApiResponse {
  branchDish: BranchDishDto;
  branchesDishes: BranchDishDto[];
}
