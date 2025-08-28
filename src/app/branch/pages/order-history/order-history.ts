import {Component, OnInit} from '@angular/core';
import {OrderDto} from '../../models/order.dto';
import {UserService} from '../../../core/services/user/user.service';
import {OrderService} from '../../services/order/order.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {ErrorMessage} from '../../../shared/models/error-message';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {OrderDetailDialog} from '../../dialogs/order-detail.dialog/order-detail.dialog';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-order-history',
  standalone: false,
  templateUrl: './order-history.html',
  styleUrl: './order-history.css'
})
export class OrderHistory implements OnInit {
  dataLoaded: number = 0;

  branchId: number = 0;

  productsSize: number = 0;
  pageIndex: number = 0;

  orders: OrderDto[] = [];

  startDate: Date;
  endDate: Date;
  startDateAux: Date;
  endDateAux: Date;

  constructor(private userService: UserService, private orderService: OrderService,
              private snackBar: MatSnackBar, private router: Router,
              private dialog: MatDialog,) {
    const now = new Date();
    this.startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    this.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    this.startDateAux = this.startDate;
    this.endDateAux = this.endDate;
  }

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

  onViewOrder(o: OrderDto) {
    o.orderTotal = o.items.reduce((acc, it) => acc + (it.quantity * it.unitPrice), 0);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      order: o,
      history: true,
    };

    this.dialog.open(OrderDetailDialog, dialogConfig);
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.startDate = this.startDateAux;
    this.endDate = this.endDateAux;
    this.refreshOrders();
  }

  refreshOrders() {
    this.startDate.setHours(0,0,0,0);
    this.endDate.setHours(23,59,59,999);
    const getOrderByFilterDto = {
      branchId: this.branchId,
      page: this.pageIndex + 1,
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this.orderService.getByFilter(getOrderByFilterDto).subscribe({
      next: (response) => {
        this.orders = response.orders;
        this.productsSize = response.total;
        for (const order of response.orders) {
          order.itemsSize = order.items.reduce((acc, it) => acc + it.quantity, 0);
        }
        this.dataLoaded = 1;
        this.startDateAux = this.startDate;
        this.endDateAux = this.endDate;
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.dataLoaded = -1;
      }
    });
  }

  searchByDate() {
    this.pageIndex = 0;
    this.refreshOrders();
  }
}
