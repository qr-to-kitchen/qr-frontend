import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrderDto} from '../../models/order.dto';
import {OrderService} from '../../services/order/order.service';
import {firstValueFrom} from 'rxjs';
import {ErrorMessage} from '../../../shared/models/error-message';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {UserService} from '../../../core/services/user/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {OrderDetailDialog} from '../../dialogs/order-detail.dialog/order-detail.dialog';
import {io, Socket} from 'socket.io-client';
import {environment} from '../../../../environment/environment';
import {BranchService} from '../../../core/services/branch/branch.service';
import {BranchDto} from '../../../core/models/branch.dto';

@Component({
  selector: 'app-kitchen',
  standalone: false,
  templateUrl: './kitchen.html',
  styleUrl: './kitchen.css'
})
export class Kitchen implements OnInit, OnDestroy {
  viewMode: string = 'board';

  branchId: number = 0;

  branch: BranchDto = {} as BranchDto;

  ordersCreated: OrderDto[] = [];
  ordersCooking: OrderDto[] = [];
  ordersReady: OrderDto[] = [];

  orders : OrderDto[] = [];

  socket: Socket;

  constructor(private userService: UserService, private orderService: OrderService,
              private branchService: BranchService, private snackBar: MatSnackBar,
              private router: Router, private dialog: MatDialog,) {
    this.socket = io(environment.sockerUrl, {
      path: environment.production ? '/qr/socket.io' : '/socket.io',
      transports: ['websocket'],
      forceNew: true
    });
  }

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('token')) {
      try {
        const userApiResponse =  await firstValueFrom(this.userService.getObject());
        if (userApiResponse.user.role === "BRANCH") {
          if (userApiResponse.user.branch.dailyCode == null) {
            const branchApiResponse =  await firstValueFrom(this.branchService.refreshDailyCode(userApiResponse.user.branch.id));
            userApiResponse.user.branch = branchApiResponse.branch;
          } else {
            const today = new Date();
            const dailyCodeDate = new Date(userApiResponse.user.branch.dailyCodeUpdatedAt);
            if (today.getDate() !== dailyCodeDate.getDate() || today.getMonth() !== dailyCodeDate.getMonth() || today.getFullYear() !== dailyCodeDate.getFullYear()) {
              const branchApiResponse =  await firstValueFrom(this.branchService.refreshDailyCode(userApiResponse.user.branch.id));
              userApiResponse.user.branch = branchApiResponse.branch;
            }
          }
          this.branchId = userApiResponse.user.branch.id;
          this.branch = userApiResponse.user.branch;
          this.refreshOrders();

          this.socket.emit('joinBranchRoom', this.branchId);
        } else {
          localStorage.clear();
          this.snackBar.open("Vuelva a iniciar sesión", "Entendido", {duration: 2000});
          this.router.navigate(['/login']).then();
        }
      } catch (error: any) {
        localStorage.clear();
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.router.navigate(['/login']).then();
      }
    } else {
      localStorage.clear();
      this.snackBar.open("Vuelva a iniciar sesión", "Entendido", {duration: 2000});
      this.router.navigate(['/login']).then();
    }

    this.socket.on('newOrder', () => {
      this.refreshOrders();
    });
  }

  ngOnDestroy(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  changeViewMode($event: any) {
    this.viewMode = $event.value;
  }

  onViewOrder(o: OrderDto) {
    o.orderTotal = o.items.reduce((acc, it) => acc + (it.quantity * it.unitPrice), 0);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      order: o,
      history: false,
    };

    const dialogRef = this.dialog.open(OrderDetailDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result: OrderDto) => {
      if (result) {
        this.socket.emit('updateOrder', { orderId: result.id });
        this.refreshOrders();
      }
    })
  }

  refreshOrders() {
    this.orderService.getActiveByBranchId(this.branchId).subscribe({
      next: (response) => {
        this.orders = response.orders;
        this.ordersCreated = [];
        this.ordersCooking = [];
        this.ordersReady = [];
        for (const order of response.orders) {
          order.itemsSize = order.items.reduce((acc, it) => acc + it.quantity, 0);
          if (order.status === 'CREADO') {
            this.ordersCreated = [...this.ordersCreated, order];
          } else if (order.status === 'COCINANDO') {
            this.ordersCooking = [...this.ordersCooking, order];
          } else if (order.status === 'LISTO') {
            this.ordersReady = [...this.ordersReady, order];
          }
        }
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
