import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {BranchDishDto} from '../../models/branch-dish.dto';
import {BranchDishService} from '../../services/branch-dish/branch-dish.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BranchDto} from '../../../core/models/branch.dto';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {firstValueFrom} from 'rxjs';
import {ErrorMessage} from '../../../shared/models/error-message';
import {io, Socket} from 'socket.io-client';
import {environment} from '../../../../environment/environment';

type CreateBranchDishes = {
  branch: BranchDto;
}

@Component({
  selector: 'app-create-branch-dishes.dialog',
  standalone: false,
  templateUrl: './create-branch-dishes.dialog.html',
  styleUrl: './create-branch-dishes.dialog.css'
})
export class CreateBranchDishesDialog implements OnInit, OnDestroy {
  dataLoaded: boolean = false;
  savingBranchDishes: boolean = false;

  dataSaved: boolean = false;

  branchDishes: BranchDishDto[] = [];

  displayedColumns: string[] = ['add', 'dish', 'actions'];

  socket: Socket;

  constructor(
    private branchDishService: BranchDishService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: CreateBranchDishes,
  ) {
    this.socket = io(environment.sockerUrl, {
      path: environment.production ? '/qr/socket.io' : '/socket.io',
      transports: ['websocket'],
      forceNew: true
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      const branchDishApiResponse = await firstValueFrom(this.branchDishService.getByRestaurantIdAndNoBranchId(this.data.branch.restaurant.id, this.data.branch.id));

      for (const dish of branchDishApiResponse.dishes) {
        const branchDish: BranchDishDto = {} as BranchDishDto;
        branchDish.changed = false;
        branchDish.branch = this.data.branch;
        branchDish.dish = dish;
        this.branchDishes = [...this.branchDishes, branchDish];
      }
      this.dataLoaded = true;

      this.socket.on('small-snackbar-updates', (data: { current: number, total: number }) => {
        if (data.current === data.total) {
          this.snackBar.open(`${data.current} de ${data.total} platos en sede actualizados`, "", { duration: 2000 });
        } else {
          this.snackBar.open(`${data.current} de ${data.total} platos en sede actualizados`);
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

  onSaveBranchDish(d: BranchDishDto) {
    d.branchId = d.branch.id;
    d.dishId = d.dish.id;
    d.isAvailable = true;
    this.snackBar.open('Creando nuevo plato en sede');
    this.savingBranchDishes = true;
    this.branchDishService.create(d).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.savingBranchDishes = false;
        this.branchDishes = this.branchDishes.filter(branchDish => !(branchDish.branch.id === response.branchDish.branch.id && branchDish.dish.id === response.branchDish.dish.id));
        this.dataSaved = true;
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.savingBranchDishes = false;
      }
    })
  }

  onSaveBranchDishes() {
    const branchDishesChanged: BranchDishDto[] = this.branchDishes.filter(branchDish => branchDish.changed);
    if (branchDishesChanged.length === 0) {
      this.snackBar.open('No hay cambios para guardar', "Entendido", { duration: 2000 });
    } else {
      for (const branchDish of branchDishesChanged) {
        branchDish.branchId = branchDish.branch.id;
        branchDish.dishId = branchDish.dish.id;
        branchDish.isAvailable = true;
      }
      this.snackBar.open('Actualizando platos en sede');
      this.savingBranchDishes = true;
      this.branchDishService.bulkSave({ branchDishes: branchDishesChanged, socketId: this.socket.id! }).subscribe({
        next: (response) => {
          this.savingBranchDishes = false;
          this.branchDishes = this.branchDishes.filter(branchDish => {
            const match = response.branchesDishes.find(bd => bd.branch.id === branchDish.branch.id && bd.dish.id === branchDish.dish.id);
            return !match;
          });
          this.dataSaved = true;
        },
        error: (error: ErrorMessage) => {
          this.snackBar.openFromComponent(ErrorSnackBar, {
            data: {
              messages: error.message
            },
            duration: 2000
          });
          this.savingBranchDishes = false;
        }
      });
    }
  }

  onToggleBranchDish(d: BranchDishDto) {
    d.changed = !d.changed;
  }
}
