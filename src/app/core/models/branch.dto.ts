import {RestaurantDto} from './restaurant.dto';
import {BranchDishDto} from '../../admin/models/branch-dish.dto';
import {ExtraBranchDto} from '../../admin/models/extra-branch.dto';

export interface BranchDto {
  id: number;
  address: string;
  dailyCode: string;
  dailyCodeUpdatedAt: Date;
  sourceBranchId: number;
  restaurant: RestaurantDto;
  branchDishes: BranchDishDto[];
  extraBranches: ExtraBranchDto[];
}
