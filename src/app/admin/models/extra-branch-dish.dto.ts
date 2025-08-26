import {BranchDishDto} from './branch-dish.dto';
import {ExtraBranchDto} from './extra-branch.dto';

export interface ExtraBranchDishDto {
  id: number;
  isAvailable: boolean;
  branchDish: BranchDishDto;
  extraBranch: ExtraBranchDto;

  changed: boolean;
  branchDishId: number;
  extraBranchId: number;
}
