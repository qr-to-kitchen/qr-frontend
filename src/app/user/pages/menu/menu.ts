import {Component, OnInit} from '@angular/core';
import {BranchService} from '../../../core/services/branch/branch.service';
import {firstValueFrom} from 'rxjs';
import {BranchDto} from '../../../core/models/branch.dto';
import {RestaurantDto} from '../../../core/models/restaurant.dto';
import {CategoryDto} from '../../../admin/models/category.dto';
import {CategoryService} from '../../../admin/services/category/category.service';
import {ActivatedRoute} from '@angular/router';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BranchDishService} from '../../../admin/services/branch-dish/branch-dish.service';
import {BranchDishDto} from '../../../admin/models/branch-dish.dto';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddToCartDialog} from '../../dialogs/add-to-cart.dialog/add-to-cart.dialog';
import {OrderItemDto} from '../../../branch/models/order-item.dto';
import {OrderAuxService} from '../../../shared/services/order-aux/order-aux.service';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit {
  branchId: number = 0;
  activeCategoryId: number = 0;

  cartLength: number = 0;

  branch: BranchDto = {} as BranchDto;

  categories: CategoryDto[] = [];
  branchesDishes: BranchDishDto[] = [];

  constructor(private branchService: BranchService, private categoriesService: CategoryService,
              private branchDishService: BranchDishService, private route: ActivatedRoute,
              private snackBar: MatSnackBar, private dialog: MatDialog,
              private orderAuxService: OrderAuxService) {
    this.branch.restaurant = {} as RestaurantDto;
    this.cartLength = this.orderAuxService.getOrderItemsLength();
  }

  async ngOnInit(): Promise<void> {
    try {
      this.branchId = this.route.snapshot.params['branchId'];
      const branchApiResponse =  await firstValueFrom(this.branchService.getById(this.branchId));
      this.branch = branchApiResponse.branch;

      const categoryApiResponse = await firstValueFrom(this.categoriesService.getByRestaurantId(this.branch.restaurant.id));
      this.categories = categoryApiResponse.categories;
      this.activeCategoryId = this.categories[0].id;

      try {
        const branchDishApiResponse = await firstValueFrom(this.branchDishService.getByBranchIdAndCategoryId(this.branchId, this.activeCategoryId));
        this.branchesDishes = branchDishApiResponse.branchesDishes;
      } catch (error: any) {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.branchesDishes = [];
      }
    } catch (error: any) {
      this.snackBar.openFromComponent(ErrorSnackBar, {
        data: {
          messages: error.message
        },
        duration: 2000
      });
    }
  }

  async changeCategory(id: number) {
    try {
      this.activeCategoryId = id;
      const branchDishApiResponse = await firstValueFrom(this.branchDishService.getByBranchIdAndCategoryId(this.branchId, this.activeCategoryId));
      this.branchesDishes = branchDishApiResponse.branchesDishes;
    } catch (error: any) {
      this.snackBar.openFromComponent(ErrorSnackBar, {
        data: {
          messages: error.message
        },
        duration: 2000
      });
      this.branchesDishes = [];
    }
  }

  onAddToCart(branchDish: BranchDishDto) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      branchDish: branchDish
    };

    const dialogRef = this.dialog.open(AddToCartDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result: OrderItemDto) => {
      if (result) {
        this.orderAuxService.addOrderItem(result);
        this.cartLength = this.orderAuxService.getOrderItemsLength();
      }
    });
  }
}
