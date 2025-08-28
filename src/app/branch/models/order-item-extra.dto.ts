import {ExtraBranchDishDto} from '../../admin/models/extra-branch-dish.dto';

export interface OrderItemExtraDto {
  id: number;
  unitPrice: number;
  extraBranchDish: ExtraBranchDishDto;
}
