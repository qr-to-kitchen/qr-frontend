import {BranchDto} from '../../core/models/branch.dto';
import {ExtraDto} from './extra.dto';
import {ExtraBranchDishDto} from './extra-branch-dish.dto';

export interface ExtraBranchDto {
  id: number;
  branch: BranchDto;
  extra: ExtraDto;
  extraBranchDishes: ExtraBranchDishDto[];

  changed: boolean;
  branchId: number;
  extraId: number;
}
