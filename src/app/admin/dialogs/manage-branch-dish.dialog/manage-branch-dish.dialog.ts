import {Component, Inject, OnInit} from '@angular/core';
import {DishDto} from '../../models/dish.dto';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BranchDishDto} from '../../models/branch-dish.dto';
import {BranchService} from '../../../core/services/branch/branch.service';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {MatSnackBar} from '@angular/material/snack-bar';
import {firstValueFrom} from 'rxjs';
import {BranchDishService} from '../../services/branch-dish/branch-dish.service';
import {ErrorMessage} from '../../../shared/models/error-message';

type ManageDish = {
  dish: DishDto;
  restaurantId: number;
};

@Component({
  selector: 'app-manage-branch-dish.dialog',
  standalone: false,
  templateUrl: './manage-branch-dish.dialog.html',
  styleUrl: './manage-branch-dish.dialog.css'
})
export class ManageBranchDishDialog implements OnInit {
  dataLoaded: boolean = false;
  savingBranchDish: boolean = false;

  branchesDishes: BranchDishDto[] = [];

  displayedColumns: string[] = ['branch', 'status', 'price', 'actions'];

  constructor(
    private branchService: BranchService,
    private branchDishService: BranchDishService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: ManageDish,
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      const branchApiResponse =  await firstValueFrom(this.branchService.getByRestaurantId(this.data.restaurantId));

      for (const branch of branchApiResponse.branches) {
        try {
          const branchDishApiResponse =  await firstValueFrom(this.branchDishService.getBranchDishByBranchIdAndDishId(branch.id, this.data.dish.id));
          branchDishApiResponse.branchDish.changed = false;
          this.branchesDishes = [...this.branchesDishes, branchDishApiResponse.branchDish];
        } catch {
          const branchDish: BranchDishDto = {} as BranchDishDto;
          branchDish.changed = false;
          branchDish.branch = branch;
          branchDish.dish = this.data.dish;
          this.branchesDishes = [...this.branchesDishes, branchDish];
        }
      }
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

  onSaveBranchDish(b: BranchDishDto) {
    b.branchId = b.branch.id;
    b.dishId = b.dish.id;
    if (b.id) {
      this.snackBar.open('Actualizando plato en sede');
      this.savingBranchDish = true;
      this.branchDishService.update(b.id, b).subscribe({
        next: (response) => {
          this.snackBar.dismiss();
          this.savingBranchDish = false;
          this.branchesDishes = this.branchesDishes.map(branchDish => branchDish.id === response.branchDish.id ? response.branchDish : branchDish);
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
    } else {
      this.snackBar.open('Creando nuevo plato en sede');
      this.savingBranchDish = true;
      this.branchDishService.create(b).subscribe({
        next: (response) => {
          this.snackBar.dismiss();
          this.savingBranchDish = false;
          this.branchesDishes = this.branchesDishes.map(branchDish => branchDish.branch.id === response.branchDish.branch.id && branchDish.dish.id === response.branchDish.dish.id ? response.branchDish : branchDish);
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

  onChangeAvailability(b: BranchDishDto) {
    b.isAvailable = !b.isAvailable;
    b.changed = true;
  }

  onBranchDishChanged(b: BranchDishDto) {
    b.changed = true;
  }
}
