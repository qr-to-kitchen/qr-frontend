import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import { firstValueFrom } from "rxjs";
import {UserDto} from '../../models/user.dto';
import {RestaurantService} from '../../services/restaurant/restaurant.service';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {RestaurantDto} from '../../models/restaurant.dto';
import {ErrorMessage} from '../../../shared/models/error-message';

@Component({
  selector: 'app-profile-admin',
  standalone: false,
  templateUrl: './profile-admin.html',
  styleUrl: './profile-admin.css'
})
export class ProfileAdmin  implements OnInit {
  @Input() role: string = '';

  user: UserDto = {} as UserDto;
  userToUpdate: UserDto = {} as UserDto;
  restaurant: RestaurantDto = {} as RestaurantDto;
  restaurantToUpdate: RestaurantDto = {} as RestaurantDto;

  dataLoaded: boolean = false;
  userSaving: boolean = false;
  restaurantSaving: boolean = false;

  constructor(private userService: UserService, private restaurantService: RestaurantService,
              private snackBar: MatSnackBar, private router: Router) { }

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('token')) {
      try {
        const userApiResponse =  await firstValueFrom(this.userService.getObject());
        if (userApiResponse.user.role === "ADMIN") {
          this.user = userApiResponse.user;
          this.userToUpdate = {...userApiResponse.user};

          const restaurantApiResponse =  await firstValueFrom(this.restaurantService.getObject());
          this.restaurant = restaurantApiResponse.restaurant;
          this.restaurantToUpdate = {...restaurantApiResponse.restaurant};

          this.dataLoaded = true;
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

  onUpdateUser() {
    this.snackBar.open('Actualizando usuario');
    this.userSaving = true;
    this.userService.update(this.userToUpdate.id, this.userToUpdate).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.userSaving = false;
        this.user = response.user;
        this.userToUpdate = {...response.user};
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.userSaving = false;
      }
    });
  }

  onUpdateRestaurant() {
    this.snackBar.open('Actualizando restaurante');
    this.restaurantSaving = true;
    this.restaurantService.update(this.restaurantToUpdate.id, this.restaurantToUpdate).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.restaurantSaving = false;
        this.restaurant = response.restaurant;
        this.restaurantToUpdate = {...response.restaurant};
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.restaurantSaving = false;
      }
    });
  }
}
