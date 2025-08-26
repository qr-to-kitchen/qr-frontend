import {Component, Inject} from '@angular/core';
import {ExtraService} from '../../services/extra/extra.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ExtraDto} from '../../models/extra.dto';
import {ErrorMessage} from '../../../shared/models/error-message';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';

type AddExtra = {
  extra: ExtraDto;
};

@Component({
  selector: 'app-create-extra.dialog',
  standalone: false,
  templateUrl: './create-extra.dialog.html',
  styleUrl: './create-extra.dialog.css'
})
export class CreateExtraDialog {
  creating: boolean = false;

  constructor(
    private extraService: ExtraService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateExtraDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddExtra,
  ) { }

  onCreateExtra() {
    this.snackBar.open('Creando nuevo extra');
    this.creating = true;
    this.extraService.create(this.data.extra).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.creating = false;
        this.dialogRef.close(response.extra);
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
