import {Component, Inject, OnInit} from '@angular/core';
import {OrderItemDto} from '../../../branch/models/order-item.dto';
import {ExtraBranchDishDto} from '../../../admin/models/extra-branch-dish.dto';
import {ExtraService} from '../../../admin/services/extra/extra.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ErrorMessage} from '../../../shared/models/error-message';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {OrderItemExtraDto} from '../../../branch/models/order-item-extra.dto';

type EditItem = {
  orderItem: OrderItemDto;
};

@Component({
  selector: 'app-edit-item.dialog',
  standalone: false,
  templateUrl: './edit-item.dialog.html',
  styleUrl: './edit-item.dialog.css'
})
export class EditItemDialog implements OnInit {
  extraBranchDishes: ExtraBranchDishDto[] = [];

  constructor(
    private extraService: ExtraService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditItemDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EditItem,
  ) { }

  async ngOnInit(): Promise<void> {
    this.extraService.getExtraBranchDishByBranchDishId(this.data.orderItem.branchDish.id).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        const selectedExtrasIds = this.data.orderItem.itemExtras.map(itemExtra => itemExtra.extraBranchDish.id);
        this.extraBranchDishes = response.extraBranchDishes.map(extraBranchDish => {
          extraBranchDish.selected = selectedExtrasIds.includes(extraBranchDish.id);
          return extraBranchDish;
        });
        this.data.orderItem.itemExtras = [];
      },
      error: (error: ErrorMessage) => {
        if (error.statusCode !== 404) {
          this.snackBar.openFromComponent(ErrorSnackBar, {
            data: {
              messages: error.message
            },
            duration: 2000
          });
        }
        this.extraBranchDishes = [];
      }
    })
  }

  saveChanges() {
    for (const extraBranchDish of this.extraBranchDishes) {
      if (extraBranchDish.selected) {
        const orderItemExtra: OrderItemExtraDto = {} as OrderItemExtraDto;
        orderItemExtra.extraBranchDish = extraBranchDish;
        orderItemExtra.unitPrice = Number(extraBranchDish.customPrice || extraBranchDish.extraBranch.extra.basePrice);
        this.data.orderItem.itemExtras = [...this.data.orderItem.itemExtras, orderItemExtra];
      }
    }
    this.dialogRef.close(this.data.orderItem);
  }

  onExtraChange(extra: ExtraBranchDishDto, checked: boolean) {
    extra.selected = checked;
    const extraSum = this.extraBranchDishes.reduce((acc, ex) => ex.selected ? acc + Number(ex.customPrice || ex.extraBranch.extra.basePrice) : acc, 0);
    this.data.orderItem.unitPrice = Number(this.data.orderItem.branchDish.customPrice || this.data.orderItem.branchDish.dish.basePrice) + extraSum;
    this.data.orderItem.total = this.data.orderItem.unitPrice * this.data.orderItem.quantity;
  }

  decrement() {
    this.data.orderItem.quantity--;
    const extraSum = this.extraBranchDishes.reduce((acc, ex) => ex.selected ? acc + Number(ex.customPrice || ex.extraBranch.extra.basePrice) : acc, 0);
    this.data.orderItem.unitPrice = Number(this.data.orderItem.branchDish.customPrice || this.data.orderItem.branchDish.dish.basePrice) + extraSum;
    this.data.orderItem.total = this.data.orderItem.unitPrice * this.data.orderItem.quantity;
  }

  increment() {
    this.data.orderItem.quantity++;
    const extraSum = this.extraBranchDishes.reduce((acc, ex) => ex.selected ? acc + Number(ex.customPrice || ex.extraBranch.extra.basePrice) : acc, 0);
    this.data.orderItem.unitPrice = Number(this.data.orderItem.branchDish.customPrice || this.data.orderItem.branchDish.dish.basePrice) + extraSum;
    this.data.orderItem.total = this.data.orderItem.unitPrice * this.data.orderItem.quantity;
  }
}
