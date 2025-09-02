import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../core/services/user/user.service';
import {BranchService} from '../../../core/services/branch/branch.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {BranchDishService} from '../../services/branch-dish/branch-dish.service';
import {firstValueFrom} from 'rxjs';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {BranchDishDto} from '../../models/branch-dish.dto';
import {MatSidenav} from '@angular/material/sidenav';
import {ErrorMessage} from '../../../shared/models/error-message';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {
  ManageBranchDishExtrasDialog
} from '../../dialogs/manage-branch-dish-extras.dialog/manage-branch-dish-extras.dialog';

@Component({
  selector: 'app-branch-detail-dishes',
  standalone: false,
  templateUrl: './branch-detail-dishes.html',
  styleUrl: './branch-detail-dishes.css'
})
export class BranchDetailDishes implements OnInit {
  dataLoaded: boolean = false;
  savingBranchDish: boolean = false;

  branchId: number = 0;

  branchesDishes: BranchDishDto[] = [];
  branchDishToEdit: BranchDishDto = {} as BranchDishDto;

  displayedColumns: string[] = ['name', 'description', 'category', 'basePrice', 'availability', 'actions'];

  constructor(private userService: UserService, private branchService: BranchService,
              private branchDishService: BranchDishService, private snackBar: MatSnackBar,
              private router: Router, private route: ActivatedRoute,
              private dialog: MatDialog,) {
    this.branchDishToEdit.branch = {} as any;
    this.branchDishToEdit.dish = {} as any;
    this.branchDishToEdit.dish.category = {} as any;
  }

  async ngOnInit() {
    if (localStorage.getItem('token')) {
      try {
        const userApiResponse =  await firstValueFrom(this.userService.getObject());
        if (userApiResponse.user.role === "ADMIN") {
          this.branchId = this.route.snapshot.params['branchId'];

          try {
            const branchApiResponse =  await firstValueFrom(this.branchService.getById(this.branchId));

            if (branchApiResponse.branch.restaurant.id === userApiResponse.user.restaurant.id) {
              const branchDishApiResponse = await firstValueFrom(this.branchDishService.getByBranchId(this.branchId));
              this.branchesDishes = branchDishApiResponse.branchesDishes;
              this.dataLoaded = true;
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

  }

  openEditDrawer(editDrawer: MatSidenav, branchDish: BranchDishDto) {
    editDrawer.open().then();
    this.branchDishToEdit = {...branchDish};
  }

  onUpdateBranchDish(editDrawer: MatSidenav) {
    this.snackBar.open('Actualizando plato en sede');
    this.savingBranchDish = true;
    this.branchDishService.update(this.branchDishToEdit.id, this.branchDishToEdit).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.savingBranchDish = false;
        this.branchesDishes = this.branchesDishes.map(branchDish => branchDish.id === response.branchDish.id ? response.branchDish : branchDish);
        editDrawer.close().then();
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.savingBranchDish = false;
      }
    });
  }

  manageBranchDish(branchDish: BranchDishDto) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.maxWidth = '700px';
    dialogConfig.data = {
      branchDish: branchDish,
      branchId: this.branchId,
    };

    this.dialog.open(ManageBranchDishExtrasDialog, dialogConfig);
  }
}
