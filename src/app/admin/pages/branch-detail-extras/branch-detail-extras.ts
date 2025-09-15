import {Component, OnInit} from '@angular/core';
import {ExtraBranchDto} from '../../models/extra-branch.dto';
import {UserService} from '../../../core/services/user/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {BranchService} from '../../../core/services/branch/branch.service';
import {firstValueFrom} from 'rxjs';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {ExtraService} from '../../services/extra/extra.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {
  ManageExtraBranchDishesDialog
} from '../../dialogs/manage-extra-branch-dishes.dialog/manage-extra-branch-dishes.dialog';
import {BranchDto} from '../../../core/models/branch.dto';
import {CreateExtraBranchesDialog} from '../../dialogs/create-extra-branches.dialog/create-extra-branches.dialog';

@Component({
  selector: 'app-branch-detail-extras',
  standalone: false,
  templateUrl: './branch-detail-extras.html',
  styleUrl: './branch-detail-extras.css'
})
export class BranchDetailExtras implements OnInit {
  dataLoaded: boolean = false;

  branchId: number = 0;

  branch: BranchDto = {} as BranchDto;
  extraBranches: ExtraBranchDto[] = [];

  displayedColumns: string[] = ['name', 'basePrice', 'extraBranchDishes'];

  constructor(private userService: UserService, private branchService: BranchService,
              private extraService: ExtraService, private snackBar: MatSnackBar,
              private router: Router, private route: ActivatedRoute,
              private dialog: MatDialog,) { }

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('token')) {
      try {
        const userApiResponse =  await firstValueFrom(this.userService.getObject());
        if (userApiResponse.user.role === "ADMIN") {
          this.branchId = this.route.snapshot.params['branchId'];

          try {
            const branchApiResponse =  await firstValueFrom(this.branchService.getById(this.branchId));
            this.branch = branchApiResponse.branch;
            if (branchApiResponse.branch.restaurant.id === userApiResponse.user.restaurant.id) {
              try {
                const extraBranchApiResponse = await firstValueFrom(this.extraService.getExtraBranchByBranchId(this.branchId));
                this.extraBranches = extraBranchApiResponse.extraBranches;
                this.dataLoaded = true;
              } catch (error: any) {
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
            } else {
              localStorage.clear();
              this.snackBar.open("Sede no corresponde a su restaurante", "Entendido", {duration: 2000});
              this.router.navigate(['/login']).then();
            }
          } catch (error: any) {
            this.snackBar.openFromComponent(ErrorSnackBar, {
              data: {
                messages: error.message
              },
              duration: 2000
            });
          }
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
    dialogConfig.maxWidth = '700px';
    dialogConfig.data = {
      branch: this.branch,
    };

    const dialogRef = this.dialog.open(CreateExtraBranchesDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        try {
          this.dataLoaded = true;
          const extraBranchApiResponse = await firstValueFrom(this.extraService.getExtraBranchByBranchId(this.branchId));
          this.extraBranches = extraBranchApiResponse.extraBranches;
          this.dataLoaded = true;
        } catch (error: any) {
          this.snackBar.openFromComponent(ErrorSnackBar, {
            data: {
              messages: error.message
            },
            duration: 2000
          });
        }
      }
    });
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
