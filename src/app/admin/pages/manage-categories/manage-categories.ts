import {Component, OnInit} from '@angular/core';
import {CategoryDto} from '../../models/category.dto';
import {UserService} from '../../../core/services/user/user.service';
import {CategoryService} from '../../services/category/category.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {RestaurantDto} from '../../../core/models/restaurant.dto';
import {firstValueFrom} from 'rxjs';
import {ErrorMessage} from '../../../shared/models/error-message';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CreateCategoryDialog} from '../../dialogs/create-category.dialog/create-category.dialog';

@Component({
  selector: 'app-manage-categories',
  standalone: false,
  templateUrl: './manage-categories.html',
  styleUrl: './manage-categories.css'
})
export class ManageCategories implements OnInit {
  dataLoaded: boolean = false;
  savingCategory: boolean = false;

  restaurantId: number = 0;

  categories: CategoryDto[] = [];
  categoryToEdit: CategoryDto = {} as CategoryDto;

  displayedColumns: string[] = ['name', 'displayOrder', 'dishes', 'visible', 'actions'];

  constructor(private userService: UserService, private categoryService: CategoryService,
              private snackBar: MatSnackBar, private router: Router,
              private dialog: MatDialog,) {
    this.categoryToEdit.restaurant = {} as RestaurantDto;
  }

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('token')) {
      try {
        const userApiResponse =  await firstValueFrom(this.userService.getObject());
        if (userApiResponse.user.role === "ADMIN") {
          this.restaurantId = userApiResponse.user.restaurant.id
          this.categoryService.getByRestaurantId(this.restaurantId).subscribe({
            next: (response) => {
              this.categories = response.categories;
              this.dataLoaded = true;
            },
            error: (error: ErrorMessage) => {
              this.snackBar.openFromComponent(ErrorSnackBar, {
                data: {
                  messages: error.message
                },
                duration: 2000
              });
            }
          })
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
      category: {
        restaurantId: this.restaurantId,
      }
    };

    const dialogRef = this.dialog.open(CreateCategoryDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result: CategoryDto) => {
      if (result) {
        this.categories = [...this.categories, result];
      }
    });
  }

  openEditDrawer(editDrawer: any, category: CategoryDto) {
    editDrawer.open().then();
    this.categoryToEdit = {...category};
  }

  onUpdateCategory(editDrawer: any) {
    this.snackBar.open('Actualizando categoría');
    this.savingCategory = true;
    this.categoryService.update(this.categoryToEdit.id, this.categoryToEdit).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.savingCategory = false;
        this.categories = this.categories.map(category => category.id === response.category.id ? response.category : category);
        editDrawer.close().then();
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.savingCategory = false;
      }
    });
  }

  onChangeVisibility() {
    this.categoryToEdit.visible = !this.categoryToEdit.visible;
  }
}
