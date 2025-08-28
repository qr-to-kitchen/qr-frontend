import {Component, Inject} from '@angular/core';
import {CategoryService} from '../../services/category/category.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CategoryDto} from '../../models/category.dto';
import {ErrorMessage} from '../../../shared/models/error-message';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';

type AddCategory = {
  category: CategoryDto;
};

@Component({
  selector: 'app-create-category.dialog',
  standalone: false,
  templateUrl: './create-category.dialog.html',
  styleUrl: './create-category.dialog.css'
})
export class CreateCategoryDialog {
  creating: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateCategoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddCategory,
  ) { }

  onCreateCategory() {
    this.snackBar.open("Creando nueva categoría");
    this.creating = true;
    this.categoryService.create(this.data.category).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.creating = false;
        this.dialogRef.close(response.category);
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
