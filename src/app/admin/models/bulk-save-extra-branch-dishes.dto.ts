import {ExtraBranchDishDto} from './extra-branch-dish.dto';

export interface BulkSaveExtraBranchDishesDto {
  extraBranchDishes: ExtraBranchDishDto[];
  socketId: string;
}
