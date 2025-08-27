import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-kitchen',
  standalone: false,
  templateUrl: './kitchen.html',
  styleUrl: './kitchen.css'
})
export class Kitchen implements OnInit {
  viewMode: string = 'board';

  branchId: number = 0;

  ordersCreated: OrderDto[] = [];
  ordersCooking: OrderDto[] = [];
  ordersReady: OrderDto[] = [];

  orders : OrderDto[] = [];

  constructor(private userService: UserService, private orderService: OrderService,
              private snackBar: MatSnackBar, private router: Router,
              private dialog: MatDialog,) { }

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('token')) {
      try {
        const userApiResponse =  await firstValueFrom(this.userService.getObject());
        if (userApiResponse.user.role === "BRANCH") {
          this.branchId = userApiResponse.user.branch.id
          this.refreshOrders();
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
  }

  changeViewMode($event: any) {
    this.viewMode = $event.value;
  }

  onViewOrder(o: OrderDto) {
    o.orderTotal = o.items.reduce((acc, it) => acc + (it.quantity * it.unitPrice), 0);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      order: o
    };

    const dialogRef = this.dialog.open(OrderDetailDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result: OrderDto) => {
      if (result) {
        this.refreshOrders();
      }
    })
  }

  refreshOrders() {
    this.orderService.getByBranchId(this.branchId).subscribe({
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
