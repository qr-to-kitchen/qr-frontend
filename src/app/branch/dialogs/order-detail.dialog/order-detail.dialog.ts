import {Component, Inject} from '@angular/core';
import {OrderDto} from '../../models/order.dto';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {OrderService} from '../../services/order/order.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {ErrorMessage} from '../../../shared/models/error-message';

type ViewOrder = {
  order: OrderDto;
  history: boolean;
};

@Component({
  selector: 'app-order-detail.dialog',
  standalone: false,
  templateUrl: './order-detail.dialog.html',
  styleUrl: './order-detail.dialog.css'
})
export class OrderDetailDialog {
  updatingStatus: boolean = false;

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<OrderDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ViewOrder,
  ) { }

  onAdvanceStatus() {
    const newStatus = this.data.order.status === 'CREADO' ? 'COCINANDO' : this.data.order.status === 'COCINANDO' ? 'LISTO' : this.data.order.status === 'LISTO' ? 'ENTREGADO' : '';

    if (newStatus !== '') {
      this.snackBar.open('Cambiando estado de la orden');
      this.updatingStatus = true;
      this.orderService.updateStatus(this.data.order.id, newStatus).subscribe({
        next: (response) => {
          this.snackBar.dismiss();
          this.updatingStatus = false;
          this.dialogRef.close(response.order);
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
}
