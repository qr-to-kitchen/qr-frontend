import {ExtraDto} from '../extra.dto';
import {ExtraBranchDto} from '../extra-branch.dto';
import {ExtraBranchDishDto} from '../extra-branch-dish.dto';

export interface ExtraApiResponse {
  extra: ExtraDto;
  extras: ExtraDto[];

  extraBranch: ExtraBranchDto;
  extraBranches: ExtraBranchDto[];

  extraBranchDish: ExtraBranchDishDto;
  extraBranchDishes: ExtraBranchDishDto[];
}
