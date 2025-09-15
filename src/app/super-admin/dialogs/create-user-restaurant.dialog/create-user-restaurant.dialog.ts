import {Component, Inject} from '@angular/core';
import {CreateRestaurantUserDto} from '../../models/create-restaurant-user.dto';
import {RestaurantService} from '../../../core/services/restaurant/restaurant.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ErrorMessage} from '../../../shared/models/error-message';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';

type AddUserRestaurant = {
  createRestaurantUser: CreateRestaurantUserDto;
};

@Component({
  selector: 'app-create-user-restaurant.dialog',
  standalone: false,
  templateUrl: './create-user-restaurant.dialog.html',
  styleUrl: './create-user-restaurant.dialog.css'
})
export class CreateUserRestaurantDialog {
  creating: boolean = false;

  constructor(
    private restaurantService: RestaurantService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateUserRestaurantDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddUserRestaurant,
  ) { }

  onCreateRestaurantWithUser() {
    this.snackBar.open('Creando nuevo restaurante');
    this.creating = true;
    this.restaurantService.createRestaurantWithUser(this.data.createRestaurantUser).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.creating = false;
        this.dialogRef.close(response.restaurant);
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.creating = false;
      }
    });
  }
}
