import {BranchDto} from '../../core/models/branch.dto';
import {OrderItemDto} from './order-item.dto';

export interface OrderDto {
  id: number;
  description: string;
  tableNumber: number;
  status: string;
  createdAt: Date;
  readyAt: Date;
  branch: BranchDto;
  items: OrderItemDto[];

  itemsSize: number;
}
