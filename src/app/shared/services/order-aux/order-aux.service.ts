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
    localStorage.setItem('orderStandBy', JSON.stringify(this.order));
  }

  setTableNumber(tableNumber: number) {
    this.order.tableNumber = tableNumber;
    localStorage.setItem('orderStandBy', JSON.stringify(this.order));
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
    localStorage.setItem('orderStandBy', JSON.stringify(this.order));
  }

  removeOrderItem(index: number) {
    this.order.orderTotal = this.order.orderTotal - this.order.items[index].total;
    this.order.items.splice(index, 1);
    localStorage.setItem('orderStandBy', JSON.stringify(this.order));
  }

  decrementOrderItem(index: number) {
    this.order.items[index].quantity--;
    this.order.items[index].total = this.order.items[index].unitPrice * this.order.items[index].quantity;
    this.order.orderTotal = this.order.orderTotal - this.order.items[index].unitPrice;
    localStorage.setItem('orderStandBy', JSON.stringify(this.order));
  }

  incrementOrderItem(index: number) {
    this.order.items[index].quantity++;
    this.order.items[index].total = this.order.items[index].unitPrice * this.order.items[index].quantity;
    this.order.orderTotal = this.order.orderTotal + this.order.items[index].unitPrice;
    localStorage.setItem('orderStandBy', JSON.stringify(this.order));
  }

  clearOrder() {
    this.order = {} as OrderDto;
    this.order.items = [];
    this.order.orderTotal = 0;
    localStorage.removeItem('orderStandBy');
  }

  setOrder(order: OrderDto) {
    this.order = order;
    localStorage.setItem('orderStandBy', JSON.stringify(this.order));
  }
}
