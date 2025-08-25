import {Component, Inject} from '@angular/core';
import {DishService} from '../../services/dish/dish.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DishDto} from '../../models/dish.dto';
import {ErrorMessage} from '../../../shared/models/error-message';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';

type AddDish = {
  dish: DishDto;
};

@Component({
  selector: 'app-create-dish.dialog',
  standalone: false,
  templateUrl: './create-dish.dialog.html',
  styleUrl: './create-dish.dialog.css'
})
export class CreateDishDialog {
  creating: boolean = false;

  selectedFile: File | null = null;
  imagePreview: string = '';

  constructor(
    private dishService: DishService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateDishDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddDish,
  ) { }

  onCreateDish() {
    if (this.selectedFile) {
      this.snackBar.open('Creando nuevo plato');
      this.creating = true;

      const formData = new FormData();
      formData.append('name', this.data.dish.name);
      formData.append('description', this.data.dish.description);
      formData.append('basePrice', this.data.dish.basePrice.toString());
      formData.append('restaurantId', this.data.dish.restaurantId.toString());
      formData.append('file', this.selectedFile);

      this.dishService.create(formData).subscribe({
        next: (response) => {
          this.snackBar.dismiss();
          this.creating = false;
          this.dialogRef.close(response.dish);
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
    } else {
      this.snackBar.open('Por favor, selecciona una imagen', "Entendido", { duration: 2000 });
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.imagePreview = URL.createObjectURL(this.selectedFile);
    }
  }
}
