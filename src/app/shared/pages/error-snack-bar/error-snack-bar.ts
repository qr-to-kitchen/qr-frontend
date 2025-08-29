import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';

type ErrorSnackData = {
  messages: string[] | string;
};

@Component({
  selector: 'app-error-snack-bar',
  standalone: false,
  templateUrl: './error-snack-bar.html',
  styleUrl: './error-snack-bar.css'
})
export class ErrorSnackBar {

  constructor(
    public snackBarRef: MatSnackBarRef<ErrorSnackBar>,
    @Inject(MAT_SNACK_BAR_DATA) public data: ErrorSnackData,
  ) {}

  protected readonly Array = Array;
}
