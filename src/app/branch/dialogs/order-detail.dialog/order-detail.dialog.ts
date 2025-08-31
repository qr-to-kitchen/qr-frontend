import {Component, Inject} from '@angular/core';
import {OrderDto} from '../../models/order.dto';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {OrderService} from '../../services/order/order.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {ErrorMessage} from '../../../shared/models/error-message';
import {OrderItemDto} from '../../models/order-item.dto';

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
    const body: { items: { id: number, status: string }[] } = {
      items: []
    };
    for (const item of this.data.order.items) {
      const newStatus = {
        id: item.id,
        status: item.status,
      };
      body.items.push(newStatus);
    }
    this.snackBar.open('Guardando cambios');
    this.updatingStatus = true;
    this.orderService.updateItemsStatus(this.data.order.id, body).subscribe({
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
        this.updatingStatus = false;
      }
    });
  }

  setStatus(it: OrderItemDto, st: string) {
    it.status = st;
  }

  closeOrder() {
    const itemsNotDelivered = this.data.order.items.filter(item => item.status !== 'ENTREGADO');
    if (itemsNotDelivered.length > 0) {
      this.snackBar.open('No se puede cerrar la orden porque hay productos que no han sido entregados.', "Entendido", { duration: 2000 });
    } else {
      this.snackBar.open('Cerrando orden');
      this.orderService.updateStatus(this.data.order.id, "CERRADO").subscribe({
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
          this.updatingStatus = false;
        }
      });
    }
  }
}
