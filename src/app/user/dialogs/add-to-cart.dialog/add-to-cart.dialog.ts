import {Component, Inject, OnInit} from '@angular/core';
import {BranchDishDto} from '../../../admin/models/branch-dish.dto';
import {ExtraService} from '../../../admin/services/extra/extra.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ErrorMessage} from '../../../shared/models/error-message';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {ExtraBranchDishDto} from '../../../admin/models/extra-branch-dish.dto';
import {OrderItemDto} from '../../../branch/models/order-item.dto';
import {OrderItemExtraDto} from '../../../branch/models/order-item-extra.dto';

type AddToCart = {
  branchDish: BranchDishDto;
};

@Component({
  selector: 'app-add-to-cart.dialog',
  standalone: false,
  templateUrl: './add-to-cart.dialog.html',
  styleUrl: './add-to-cart.dialog.css'
})
export class AddToCartDialog implements OnInit {
  orderItem: OrderItemDto = {} as OrderItemDto;

  extraBranchDishes: ExtraBranchDishDto[] = [];

  constructor(
    private extraService: ExtraService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddToCartDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddToCart,
  ) {
    this.orderItem.quantity = 1;
    this.orderItem.unitPrice = Number(this.data.branchDish.customPrice || this.data.branchDish.dish.basePrice);
    this.orderItem.total = this.orderItem.unitPrice * this.orderItem.quantity;
    this.orderItem.itemExtras = [];
  }

  async ngOnInit(): Promise<void> {
    this.extraService.getExtraBranchDishByBranchDishId(this.data.branchDish.id).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.extraBranchDishes = response.extraBranchDishes;
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
    });
  }

  addItemToCart() {
    this.orderItem.branchDish = this.data.branchDish;
    for (const extraBranchDish of this.extraBranchDishes) {
      if (extraBranchDish.selected) {
        const orderItemExtra: OrderItemExtraDto = {} as OrderItemExtraDto;
        orderItemExtra.extraBranchDish = extraBranchDish;
        orderItemExtra.unitPrice = Number(extraBranchDish.customPrice || extraBranchDish.extraBranch.extra.basePrice);
        this.orderItem.itemExtras = [...this.orderItem.itemExtras, orderItemExtra];
      }
    }
    this.dialogRef.close(this.orderItem);
  }

  onExtraChange(extra: ExtraBranchDishDto, checked: boolean) {
    extra.selected = checked;
    const extraSum = this.extraBranchDishes.reduce((acc, ex) => ex.selected ? acc + Number(ex.customPrice || ex.extraBranch.extra.basePrice) : acc, 0);
    this.orderItem.unitPrice = Number(this.data.branchDish.customPrice || this.data.branchDish.dish.basePrice) + extraSum;
    this.orderItem.total = this.orderItem.unitPrice * this.orderItem.quantity;
  }

  decrement() {
    this.orderItem.quantity--;
    const extraSum = this.extraBranchDishes.reduce((acc, ex) => ex.selected ? acc + Number(ex.customPrice || ex.extraBranch.extra.basePrice) : acc, 0);
    this.orderItem.unitPrice = Number(this.data.branchDish.customPrice || this.data.branchDish.dish.basePrice) + extraSum;
    this.orderItem.total = this.orderItem.unitPrice * this.orderItem.quantity;
  }

  increment() {
    this.orderItem.quantity++;
    const extraSum = this.extraBranchDishes.reduce((acc, ex) => ex.selected ? acc + Number(ex.customPrice || ex.extraBranch.extra.basePrice) : acc, 0);
    this.orderItem.unitPrice = Number(this.data.branchDish.customPrice || this.data.branchDish.dish.basePrice) + extraSum;
    this.orderItem.total = this.orderItem.unitPrice * this.orderItem.quantity;
  }
}
