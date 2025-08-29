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
    this.order.orderTotal = 0;
  }

  setBranchId(branchId: number) {
    this.order.branchId = branchId;
  }

  setTableNumber(tableNumber: number) {
    this.order.tableNumber = tableNumber;
  }

  getOrder() {
    return this.order;
  }

  getOrderItemsLength() {
    return this.order.items.length;
  }

  addOrderItem(orderItem: OrderItemDto) {
    this.order.orderTotal = this.order.orderTotal + orderItem.total;
    this.order.items.push(orderItem);
  }

  removeOrderItem(index: number) {
    this.order.orderTotal = this.order.orderTotal - this.order.items[index].total;
    this.order.items.splice(index, 1);
  }

  clearOrder() {
    this.order = {} as OrderDto;
    this.order.items = [];
    this.order.orderTotal = 0;
  }
}
