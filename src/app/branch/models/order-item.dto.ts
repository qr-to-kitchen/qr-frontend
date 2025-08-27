import {BranchDishDto} from '../../admin/models/branch-dish.dto';
import {OrderItemExtraDto} from './order-item-extra.dto';

export interface OrderItemDto {
  id: number;
  quantity: number;
  unitPrice: number;
  branchDish: BranchDishDto;
  itemExtras: OrderItemExtraDto[];
}
