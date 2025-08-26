import {Component, OnInit} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {ErrorMessage} from '../../../shared/models/error-message';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {UserService} from '../../../core/services/user/user.service';
import {BranchDishService} from '../../../admin/services/branch-dish/branch-dish.service';
import {BranchDishDto} from '../../../admin/models/branch-dish.dto';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {BranchDto} from '../../../core/models/branch.dto';
import {DishDto} from '../../../admin/models/dish.dto';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'app-manage-dishes-branch',
  standalone: false,
  templateUrl: './manage-dishes-branch.html',
  styleUrl: './manage-dishes-branch.css'
})
export class ManageDishesBranch implements OnInit {
  dataLoaded: boolean = false;
  savingBranchDish: boolean = false;

  branchId: number = 0;

  branchesDishes: BranchDishDto[] = [];
  branchDishToEdit: BranchDishDto = {} as BranchDishDto;

  displayedColumns: string[] = ['name', 'description', 'basePrice', 'availability', 'actions'];

  constructor(private userService: UserService, private branchDishService: BranchDishService,
              private snackBar: MatSnackBar, private router: Router,) {
    this.branchDishToEdit.branch = {} as BranchDto;
    this.branchDishToEdit.dish = {} as DishDto;
  }

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('token')) {
      try {
        const userApiResponse =  await firstValueFrom(this.userService.getObject());
        if (userApiResponse.user.role === "BRANCH") {
          this.branchId = userApiResponse.user.branch.id;
          this.branchDishService.getByBranchId(this.branchId).subscribe({
            next: (response) => {
              this.branchesDishes = response.branchesDishes;
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
}
