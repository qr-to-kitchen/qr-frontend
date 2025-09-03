import {BranchDishDto} from './branch-dish.dto';

export interface BulkSaveBranchDishesDto {
  branchDishes: BranchDishDto[];
  socketId: string;
}
