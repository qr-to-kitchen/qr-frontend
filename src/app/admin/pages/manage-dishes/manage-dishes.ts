import {Component, OnInit} from '@angular/core';
import {DishDto} from '../../models/dish.dto';
import {UserService} from '../../../core/services/user/user.service';
import {DishService} from '../../services/dish/dish.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RestaurantDto} from '../../../core/models/restaurant.dto';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {firstValueFrom} from 'rxjs';
import {ErrorMessage} from '../../../shared/models/error-message';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {MatSidenav} from '@angular/material/sidenav';
import {CreateDishDialog} from '../../dialogs/create-dish.dialog/create-dish.dialog';
import {ManageBranchDishDialog} from '../../dialogs/manage-branch-dish.dialog/manage-branch-dish.dialog';
import {CategoryService} from '../../services/category/category.service';
import {CategoryDto} from '../../models/category.dto';

@Component({
  selector: 'app-manage-dish',
  standalone: false,
  templateUrl: './manage-dishes.html',
  styleUrl: './manage-dishes.css'
})
export class ManageDishes implements OnInit {
  dataLoaded: boolean = false;
  savingDish: boolean = false;

  restaurantId: number = 0;

  dishes: DishDto[] = [];
  categories: CategoryDto[] = [];
  dishToEdit: DishDto = {} as DishDto;

  displayedColumns: string[] = ['image', 'name', 'description', 'category', 'basePrice', 'actions'];

  constructor(private userService: UserService, private dishService: DishService,
              private categoryService: CategoryService, private snackBar: MatSnackBar,
              private router: Router, private dialog: MatDialog) {
    this.dishToEdit.restaurant = {} as RestaurantDto;
  }

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('token')) {
      try {
        const userApiResponse =  await firstValueFrom(this.userService.getObject());
        if (userApiResponse.user.role === "ADMIN") {
          this.restaurantId = userApiResponse.user.restaurant.id;

          try {
            const dishApiResponse =  await firstValueFrom(this.dishService.getByRestaurantId(this.restaurantId));
            this.dishes = dishApiResponse.dishes;
            const categoryApiResponse =  await firstValueFrom(this.categoryService.getByRestaurantId(this.restaurantId));
            this.categories = categoryApiResponse.categories;

            this.dataLoaded = true;
          } catch (error: any) {
            this.snackBar.openFromComponent(ErrorSnackBar, {
              data: {
                messages: error.message
              },
              duration: 2000
            });
          }
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

  openCreateDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      dish: {
        restaurantId: this.restaurantId
      },
      categories: this.categories
    };

    const dialogRef = this.dialog.open(CreateDishDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result: DishDto) => {
      if (result) {
        this.dishes = [...this.dishes, result];
      }
    });
  }

  openEditDrawer(editDrawer: MatSidenav, dish: DishDto) {
    editDrawer.open().then();
    this.dishToEdit = {...dish};
    this.dishToEdit.categoryId = dish.category.id;
    this.dishToEdit.restaurant = {...dish.restaurant};
  }

  onUpdateBranch(editDrawer: MatSidenav) {
    this.snackBar.open('Actualizando plato');
    this.savingDish = true;
    this.dishService.update(this.dishToEdit.id, this.dishToEdit).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.savingDish = false;
        this.dishes = this.dishes.map(dish => dish.id === response.dish.id ? response.dish : dish);
        editDrawer.close().then();
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.savingDish = false;
      }
    });
  }

  manageBranchDish(dish: DishDto) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.maxWidth = '800px';
    dialogConfig.data = {
      dish: dish,
      restaurantId: this.restaurantId,
    };

    this.dialog.open(ManageBranchDishDialog, dialogConfig);
  }
}
