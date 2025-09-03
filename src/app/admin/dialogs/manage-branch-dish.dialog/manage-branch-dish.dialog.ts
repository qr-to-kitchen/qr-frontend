import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DishDto} from '../../models/dish.dto';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BranchDishDto} from '../../models/branch-dish.dto';
import {BranchService} from '../../../core/services/branch/branch.service';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';
import {firstValueFrom} from 'rxjs';
import {BranchDishService} from '../../services/branch-dish/branch-dish.service';
import {ErrorMessage} from '../../../shared/models/error-message';
import {io, Socket} from 'socket.io-client';
import {environment} from '../../../../environment/environment';

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
export class ManageBranchDishDialog implements OnInit, OnDestroy {
  dataLoaded: boolean = false;
  savingBranchDish: boolean = false;

  branchesDishes: BranchDishDto[] = [];

  displayedColumns: string[] = ['branch', 'status', 'price', 'actions'];

  socket: Socket;

  snackBarRef: MatSnackBarRef<any> | undefined;

  constructor(
    private branchService: BranchService,
    private branchDishService: BranchDishService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: ManageDish,
  ) {
    this.socket = io(environment.sockerUrl, {
      path: environment.production ? '/qr/socket.io' : '/socket.io',
      transports: ['websocket'],
      forceNew: true
    });
  }

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

      this.socket.on('small-snackbar-updates', (data: { current: number, total: number }) => {
        const message = `Actualizando ${data.current} de ${data.total} platos en sede`;

        if (this.snackBarRef === undefined) {
          this.snackBarRef = this.snackBar.open(message, "Cerrar");
        } else {
          this.snackBarRef.instance.message = message;
        }

        if (data.current === data.total) {
          setTimeout(() => {
            this.snackBarRef?.dismiss();
            this.snackBarRef = undefined;
          }, 1000)
        }
      });
    } catch (error: any) {
      this.snackBar.openFromComponent(ErrorSnackBar, {
        data: {
          messages: error.message
        },
        duration: 2000
      });
    }
  }

  ngOnDestroy(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
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

  onSaveBranchDishes() {
    const branchDishesChanged: BranchDishDto[] = this.branchesDishes.filter(branchDish => branchDish.changed);
    if (branchDishesChanged.length === 0) {
      this.snackBar.open('No hay cambios para guardar', "Entendido", { duration: 2000 });
    } else {
      for (const branchDish of branchDishesChanged) {
        branchDish.branchId = branchDish.branch.id;
        branchDish.dishId = branchDish.dish.id;
      }
      this.savingBranchDish = true;
      this.branchDishService.bulkSave({ branchDishes: branchDishesChanged, socketId: this.socket.id }).subscribe({
        next: (response) => {
          this.savingBranchDish = false;
          this.branchesDishes = this.branchesDishes.map(branchDish => {
            const match = response.branchesDishes.find(bd => bd.branch.id === branchDish.branch.id && bd.dish.id === branchDish.dish.id);
            return match ? match : branchDish;
          })
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
}
