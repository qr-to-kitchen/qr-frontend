import {Component, OnDestroy, OnInit} from '@angular/core';
import {RestaurantDto} from '../../../core/models/restaurant.dto';
import {BranchDto} from '../../../core/models/branch.dto';
import {RestaurantService} from '../../../core/services/restaurant/restaurant.service';
import {BranchService} from '../../../core/services/branch/branch.service';
import {firstValueFrom} from 'rxjs';
import {ErrorMessage} from '../../../shared/models/error-message';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {MatSnackBar} from '@angular/material/snack-bar';
import {OrderService} from '../../../branch/services/order/order.service';
import {RetrieveOrderDto} from '../../../branch/models/retrieve-order.dto';
import {OrderDto} from '../../../branch/models/order.dto';
import {io, Socket} from 'socket.io-client';
import {environment} from '../../../../environment/environment';

@Component({
  selector: 'app-my-order',
  standalone: false,
  templateUrl: './my-order.html',
  styleUrl: './my-order.css'
})
export class MyOrder implements OnInit, OnDestroy {
  orderExists: number = 0;
  loadingBranches: boolean = false;

  selectedRestaurantId: number = 0;
  selectedBranchId: number = 0;
  dailyCode: number = 0;
  tableNumber: number = 0;
  orderId: number = 0;

  order: OrderDto = {} as OrderDto;

  restaurants: RestaurantDto[] = [];
  branches: BranchDto[] = [];

  socket: Socket;

  constructor(private restaurantService: RestaurantService, private branchService: BranchService,
              private orderService: OrderService, private snackBar: MatSnackBar) {
    this.socket = io(environment.sockerUrl, {
      path: environment.production ? '/qr/socket.io' : '/socket.io',
      transports: ['websocket'],
      forceNew: true
    });
  }

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('orderId')) {
      this.orderId = parseInt(localStorage.getItem('orderId')!);
      this.orderService.getById(this.orderId).subscribe({
        next: (response) => {
          this.orderExists = 1;
          this.order = response.order;
          this.order.itemsSize = this.order.items.reduce((acc, it) => acc + it.quantity, 0);
          this.order.orderTotal = this.order.items.reduce((acc, it) => acc + (it.quantity * it.unitPrice), 0);

          this.socket.emit('joinOrderRoom', this.order.id);

          this.socket.on('orderUpdate', () => {
            this.refreshOrder();
          });
        },
        error: (error: ErrorMessage) => {
          this.orderExists = -1;
          this.snackBar.openFromComponent(ErrorSnackBar, {
            data: {
              messages: error.message
            },
            duration: 2000
          });
          localStorage.removeItem('orderId');
        }
      });
    } else {
      this.orderExists = -1;
      try {
        const restaurantApiResponse =  await firstValueFrom(this.restaurantService.getAll());
        this.restaurants = restaurantApiResponse.restaurants;
      } catch (error: any) {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
      }
    }
  }

  refreshOrder() {
    this.orderService.getById(this.orderId).subscribe({
      next: (response) => {
        this.orderExists = 1;
        this.order = response.order;
        this.order.itemsSize = this.order.items.reduce((acc, it) => acc + it.quantity, 0);
        this.order.orderTotal = this.order.items.reduce((acc, it) => acc + (it.quantity * it.unitPrice), 0);
      },
      error: (error: ErrorMessage) => {
        this.orderExists = -1;
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        localStorage.removeItem('orderId');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  onRestaurantChange() {
    this.loadingBranches = true;
    this.branchService.getByRestaurantId(this.selectedRestaurantId).subscribe({
      next: (response) => {
        this.branches = response.branches;
        this.loadingBranches = false;
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.loadingBranches = false;
        this.branches = [];
      }
    })
  }

  recoverOrder() {
    const retrieveOrder: RetrieveOrderDto = {
      branchId: this.selectedBranchId,
      tableNumber: this.tableNumber,
      dailyCode: this.dailyCode.toString(),
      orderId: this.orderId
    };
    this.orderService.retrieve(retrieveOrder).subscribe({
      next: (response) => {
        localStorage.setItem('orderId', response.order.id.toString());
        this.orderExists = 1;
        this.order = response.order;
        this.socket.emit('joinOrderRoom', this.order.id);

        this.socket.on('orderUpdate', () => {
          this.refreshOrder();
        });
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
      }
    });
  }
}
