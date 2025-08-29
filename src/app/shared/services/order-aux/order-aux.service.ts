import { Injectable } from '@angular/core';
import {OrderDto} from '../../../branch/models/order.dto';
import {OrderItemDto} from '../../../branch/models/order-item.dto';

@Injectable({
  providedIn: 'root'
})
export class OrderAuxService {
  private order: OrderDto = {} as OrderDto;

  constructor() {
    this.order.items = [];
  }

  getOrder() {
    return this.order;
  }

  getOrderItemsLength() {
    return this.order.items.length;
  }

  addOrderItem(orderItem: OrderItemDto) {
    this.order.items.push(orderItem);
  }
}
