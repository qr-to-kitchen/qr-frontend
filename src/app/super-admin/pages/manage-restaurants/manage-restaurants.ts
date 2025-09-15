import {Component, OnInit} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {UserService} from '../../../core/services/user/user.service';
import {RestaurantService} from '../../../core/services/restaurant/restaurant.service';
import {ErrorMessage} from '../../../shared/models/error-message';
import {RestaurantDto} from '../../../core/models/restaurant.dto';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CreateUserRestaurantDialog} from '../../dialogs/create-user-restaurant.dialog/create-user-restaurant.dialog';

@Component({
  selector: 'app-manage-restaurants',
  standalone: false,
  templateUrl: './manage-restaurants.html',
  styleUrl: './manage-restaurants.css'
})
export class ManageRestaurants implements OnInit {
  dataLoaded: boolean = false;

  restaurants: RestaurantDto[] = [];

  displayedColumns: string[] = ['name'];

  constructor(private userService: UserService, private restaurantService: RestaurantService,
              private snackBar: MatSnackBar, private router: Router,
              private dialog: MatDialog,) { }

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('token')) {
      try {
        const userApiResponse =  await firstValueFrom(this.userService.getObject());
        if (userApiResponse.user.role === "SUPER_ADMIN") {
          this.restaurantService.getAll().subscribe({
            next: (response) => {
              this.restaurants = response.restaurants;
              this.dataLoaded = true;
            },
            error: (error: ErrorMessage) => {
              if (error.statusCode === 404) {
                this.dataLoaded = true;
              }
              this.snackBar.openFromComponent(ErrorSnackBar, {
                data: {
                  messages: error.message
                },
                duration: 2000
              });
            }
          });
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
      createRestaurantUser: {
        user: {
          role: "ADMIN"
        },
        restaurant: {}
      }
    };

    const dialogRef = this.dialog.open(CreateUserRestaurantDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result: RestaurantDto) => {
      if (result) {
        this.restaurants = [...this.restaurants, result];
      }
    });
  }
}
