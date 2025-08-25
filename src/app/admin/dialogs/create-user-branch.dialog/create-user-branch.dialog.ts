import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserDto} from '../../../core/models/user.dto';
import {BranchDto} from '../../../core/models/branch.dto';
import {BranchService} from '../../../core/services/branch/branch.service';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorMessage} from '../../../shared/models/error-message';

type AddUserBranch = {
  user: UserDto;
  branch: BranchDto;
};

@Component({
  selector: 'app-create-user-branch.dialog',
  standalone: false,
  templateUrl: './create-user-branch.dialog.html',
  styleUrl: './create-user-branch.dialog.css'
})
export class CreateUserBranchDialog {
  creating: boolean = false;

  constructor(
    private branchService: BranchService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateUserBranchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddUserBranch,
  ) { }

  onCreateBranchWithUser() {
    this.snackBar.open('Creando nueva sede');
    this.creating = true;
    this.branchService.createBranchWithUser(this.data).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.creating = false;
        this.dialogRef.close(response.branch);
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
