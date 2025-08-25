import {Component, OnInit} from '@angular/core';
import {BranchDto} from '../../../core/models/branch.dto';
import {BranchService} from '../../../core/services/branch/branch.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {firstValueFrom} from 'rxjs';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {UserService} from '../../../core/services/user/user.service';
import {Router} from '@angular/router';
import {ErrorMessage} from '../../../shared/models/error-message';
import {MatSidenav} from '@angular/material/sidenav';
import {RestaurantDto} from '../../../core/models/restaurant.dto';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CreateUserBranchDialog} from '../../dialogs/create-user-branch.dialog/create-user-branch.dialog';

@Component({
  selector: 'app-manage-branches',
  standalone: false,
  templateUrl: './manage-branches.html',
  styleUrl: './manage-branches.css'
})
export class ManageBranches implements OnInit {
  dataLoaded: boolean = false;
  savingBranch: boolean = false;

  restaurantId: number = 0;

  branches: BranchDto[] = [];
  branchToEdit: BranchDto = {} as BranchDto;

  displayedColumns: string[] = ['address', 'actions'];

  constructor(private userService: UserService, private branchService: BranchService,
              private snackBar: MatSnackBar, private router: Router,
              private dialog: MatDialog) {
    this.branchToEdit.restaurant = {} as RestaurantDto;
  }

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('token')) {
      try {
        const userApiResponse =  await firstValueFrom(this.userService.getObject());
        if (userApiResponse.user.role === "ADMIN") {
          this.restaurantId = userApiResponse.user.restaurant.id
          this.branchService.getByRestaurantId(this.restaurantId).subscribe({
            next: (response) => {
              this.branches = response.branches;
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
      user: {
        role: "BRANCH"
      },
      branch: {
        restaurantId: this.restaurantId
      }
    };

    const dialogRef = this.dialog.open(CreateUserBranchDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result: BranchDto) => {
      if (result) {
        this.branches = [...this.branches, result];
      }
    });
  }

  openEditDrawer(editDrawer: MatSidenav, branch: BranchDto) {
    editDrawer.open().then();
    this.branchToEdit = {...branch};
    this.branchToEdit.restaurant = {...branch.restaurant};
  }

  onUpdateBranch(editDrawer: MatSidenav) {
    this.snackBar.open('Actualizando sede');
    this.savingBranch = true;
    this.branchService.update(this.branchToEdit.id, this.branchToEdit).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.savingBranch = false;
        this.branches = this.branches.map(branch => branch.id === response.branch.id ? response.branch : branch);
        editDrawer.close().then();
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.savingBranch = false;
      }
    });
  }
}
