import {OrderDto} from '../models/order.dto';

export interface OrderApiResponse {
  order: OrderDto;
  orders: OrderDto[];
}
