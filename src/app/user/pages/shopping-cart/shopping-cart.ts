import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrderAuxService} from '../../../shared/services/order-aux/order-aux.service';
import {OrderDto} from '../../../branch/models/order.dto';
import {OrderService} from '../../../branch/services/order/order.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorMessage} from '../../../shared/models/error-message';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {Router} from '@angular/router';
import {io, Socket} from 'socket.io-client';
import {environment} from '../../../../environment/environment';
import {OrderItemDto} from '../../../branch/models/order-item.dto';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {EditItemDialog} from '../../dialogs/edit-item.dialog/edit-item.dialog';

@Component({
  selector: 'app-shopping-cart',
  standalone: false,
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.css'
})
export class ShoppingCart implements OnInit, OnDestroy {
  waiting: boolean = false;

  order: OrderDto;

  socket: Socket;

  constructor(private orderAuxService: OrderAuxService, private orderService: OrderService,
              private snackBar: MatSnackBar, private router: Router,
              private dialog: MatDialog,) {
    this.order = this.orderAuxService.getOrder();
    this.socket = io(environment.sockerUrl, {
      path: environment.production ? '/qr/socket.io' : '/socket.io',
      transports: ['websocket'],
      forceNew: true
    });
  }

  ngOnInit(): void {
    if ((!this.order.branchId || this.order.branchId == 0) || (!this.order.tableNumber || this.order.tableNumber == 0)) {
      if (localStorage.getItem('orderStandBy') && sessionStorage.getItem('branchId') && sessionStorage.getItem('tableNumber')) {
        const order: OrderDto = JSON.parse(localStorage.getItem('orderStandBy') || '{}');
        if (order.items.length > 0) {
          const ref = this.snackBar.open(`Tienes una orden armándose. ¿Deseas recuperarla?`, 'Recuperar', { duration: 5000 });
          this.waiting = true;
          ref.afterDismissed().subscribe(({ dismissedByAction }) => {
            if (dismissedByAction) {
              order.items.forEach(it => {
                it.branchDishId = it.branchDish.id;
                if (it.itemExtras.length != 0) {
                  it.extraBranchDishIds = [];
                  for (const extra of it.itemExtras) {
                    it.extraBranchDishIds.push(extra.extraBranchDish.id);
                  }
                }
              });
              this.snackBar.open('Recuperando orden');
              this.orderService.restore(order).subscribe({
                next: (response) => {
                  this.snackBar.dismiss();
                  this.waiting = false;
                  this.orderAuxService.setOrder(response.order);
                  this.order = this.orderAuxService.getOrder();
                },
                error: (error: ErrorMessage) => {
                  this.snackBar.openFromComponent(ErrorSnackBar, {
                    data: {
                      messages: error.message
                    },
                    duration: 2000
                  });
                  this.router.navigate(['/menu', order.branchId, order.tableNumber]).then();
                }
              });
            } else {
              this.snackBar.open('Orden descartada', 'Entendido', {duration: 2000});
              this.router.navigate(['/menu', order.branchId, order.tableNumber]).then();
            }
          });
        } else {
          this.router.navigate(['/menu', order.branchId, order.tableNumber]).then();
        }
      } else {
        localStorage.removeItem('orderStandBy');
        this.snackBar.open('No tiene una orden pendiente', 'Entendido', {duration: 2000});
        this.router.navigate(['/page-not-found']).then();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  createOrder() {
    this.snackBar.open('Creando orden');
    this.order.status = 'CREADO';
    this.order.tableNumber = 2;
    for (const it of this.order.items) {
      it.branchDishId = it.branchDish.id;
      if (it.itemExtras.length != 0) {
        it.extraBranchDishIds = [];
        for (const extra of it.itemExtras) {
          it.extraBranchDishIds.push(extra.extraBranchDish.id);
        }
      }
    }
    this.orderService.create(this.order).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.orderAuxService.clearOrder();
        localStorage.removeItem('orderStandBy');
        localStorage.setItem('orderId', response.order.id.toString());
        this.socket.emit('placeOrder', { branchId: this.order.branchId });
        this.router.navigate(['/my-order']).then();
      },
      error: (error: ErrorMessage) => {
        this.orderAuxService.clearOrder();
        localStorage.removeItem('orderStandBy');
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
      }
    });
  }

  removeItem(index: number) {
    this.orderAuxService.removeOrderItem(index);
  }

  decrement(index: number) {
    this.orderAuxService.decrementOrderItem(index);
  }

  increment(index: number) {
    this.orderAuxService.incrementOrderItem(index);
  }

  editItem(orderItem: OrderItemDto, index: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      orderItem: {...orderItem}
    };

    const dialogRef = this.dialog.open(EditItemDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result: OrderItemDto) => {
      if (result) {
        this.orderAuxService.editOrderItem(result, index);
      }
    });
  }
}
