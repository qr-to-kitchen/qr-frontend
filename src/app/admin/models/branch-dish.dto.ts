import {BranchDto} from '../../core/models/branch.dto';
import {DishDto} from './dish.dto';

export interface BranchDishDto {
  id: number;
  customPrice: number;
  isAvailable: boolean;
  branch: BranchDto;
  dish: DishDto;

  changed: boolean;
  branchId: number;
  dishId: number;
}
