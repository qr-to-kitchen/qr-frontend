import {Component, OnInit} from '@angular/core';
import {ExtraBranchDto} from '../../../admin/models/extra-branch.dto';
import {UserService} from '../../../core/services/user/user.service';
import {ExtraService} from '../../../admin/services/extra/extra.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {ErrorMessage} from '../../../shared/models/error-message';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {
  ManageExtraBranchDishesDialog
} from '../../../admin/dialogs/manage-extra-branch-dishes.dialog/manage-extra-branch-dishes.dialog';

@Component({
  selector: 'app-manage-extra-branches',
  standalone: false,
  templateUrl: './manage-extra-branches.html',
  styleUrl: './manage-extra-branches.css'
})
export class ManageExtraBranches implements OnInit {
  dataLoaded: boolean = false;

  branchId: number = 0;

  extraBranches: ExtraBranchDto[] = [];

  displayedColumns: string[] = ['name', 'basePrice', 'extraBranchDishes'];

  constructor(private userService: UserService, private extraService: ExtraService,
              private snackBar: MatSnackBar, private router: Router,
              private dialog: MatDialog,) { }

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('token')) {
      try {
        const userApiResponse =  await firstValueFrom(this.userService.getObject());
        if (userApiResponse.user.role === "BRANCH") {
          this.branchId = userApiResponse.user.branch.id;
          this.extraService.getExtraBranchByBranchId(this.branchId).subscribe({
            next: (response) => {
              this.extraBranches = response.extraBranches;
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

  manageExtraBranch(extraBranch: ExtraBranchDto) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.maxWidth = '700px';
    dialogConfig.data = {
      extraBranch: extraBranch,
    };

    this.dialog.open(ManageExtraBranchDishesDialog, dialogConfig);
  }
}
