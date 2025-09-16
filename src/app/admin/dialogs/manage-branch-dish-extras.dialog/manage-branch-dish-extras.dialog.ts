import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ExtraBranchDishDto} from '../../models/extra-branch-dish.dto';
import {ExtraService} from '../../services/extra/extra.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BranchDishDto} from '../../models/branch-dish.dto';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {firstValueFrom} from 'rxjs';
import {ErrorMessage} from '../../../shared/models/error-message';
import {io, Socket} from 'socket.io-client';
import {environment} from '../../../../environment/environment';

type ManageBranchDish = {
  branchDish: BranchDishDto;
  branchId: number;
};

@Component({
  selector: 'app-manage-branch-dish-extras.dialog',
  standalone: false,
  templateUrl: './manage-branch-dish-extras.dialog.html',
  styleUrl: './manage-branch-dish-extras.dialog.css'
})
export class ManageBranchDishExtrasDialog implements OnInit, OnDestroy {
  dataLoaded: boolean = false;
  savingExtraBranchDish: boolean = false;

  extraBranchDishes: ExtraBranchDishDto[] = [];

  displayedColumns: string[] = ['extra', 'availability', 'price', 'actions'];

  socket: Socket;

  constructor(
    private extraService: ExtraService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: ManageBranchDish
  ) {
    this.socket = io(environment.sockerUrl, {
      path: environment.production ? '/qr/socket.io' : '/socket.io',
      transports: ['websocket'],
      forceNew: true
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      const extraBranchDishApiResponse = await firstValueFrom(this.extraService.getExtraBranchDishAvailabilityInExtraBranches(this.data.branchId, this.data.branchDish.id));

      for (const extraBranchDish of extraBranchDishApiResponse.extraBranchDishes) {
        extraBranchDish.changed = false;
      }
      this.extraBranchDishes = extraBranchDishApiResponse.extraBranchDishes;
      this.dataLoaded = true;

      this.socket.on('small-snackbar-updates', (data: { current: number, total: number }) => {
        if (data.current === data.total) {
          this.snackBar.open(`${data.current} de ${data.total} extras en plato actualizados`, "", { duration: 2000 });
        } else {
          this.snackBar.open(`${data.current} de ${data.total} extras en plato actualizados`);
        }
      });
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
  }

  ngOnDestroy(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  onChangeAvailability(e: ExtraBranchDishDto) {
    e.isAvailable = !e.isAvailable;
    e.changed = true;
  }

  onExtraBranchDishChanged(e: ExtraBranchDishDto) {
    e.changed = true;
  }

  onSaveExtraBranchDish(e: ExtraBranchDishDto) {
    e.extraBranchId = e.extraBranch.id;
    e.branchDishId = e.branchDish.id;
    if (e.id) {
      this.snackBar.open('Actualizando extra en plato en sede');
      this.savingExtraBranchDish = true;
      this.extraService.updateExtraBranchDish(e.id, e).subscribe({
        next: (response) => {
          this.snackBar.dismiss();
          this.savingExtraBranchDish = false;
          this.extraBranchDishes = this.extraBranchDishes.map(extraBranchDish => extraBranchDish.id === response.extraBranchDish.id ? response.extraBranchDish : extraBranchDish);
        },
        error: (error: ErrorMessage) => {
          this.snackBar.openFromComponent(ErrorSnackBar, {
            data: {
              messages: error.message
            },
            duration: 2000
          });
          this.savingExtraBranchDish = false;
        }
      });
    } else {
      this.snackBar.open('Creando nuevo extra en plato en sede');
      this.savingExtraBranchDish = true;
      this.extraService.createExtraBranchDish(e).subscribe({
        next: (response) => {
          this.snackBar.dismiss();
          this.savingExtraBranchDish = false;
          this.extraBranchDishes = this.extraBranchDishes.map(extraBranchDish => extraBranchDish.branchDish.id === response.extraBranchDish.branchDish.id && extraBranchDish.extraBranch.id === response.extraBranchDish.extraBranch.id ? response.extraBranchDish : extraBranchDish);
        },
        error: (error: ErrorMessage) => {
          this.snackBar.openFromComponent(ErrorSnackBar, {
            data: {
              messages: error.message
            },
            duration: 2000
          });
          this.savingExtraBranchDish = false;
        }
      });
    }
  }

  onSaveExtraBranchDishes() {
    const extraBranchDishesChanged: ExtraBranchDishDto[] = this.extraBranchDishes.filter(extraBranchDish => extraBranchDish.changed);
    if (extraBranchDishesChanged.length === 0) {
      this.snackBar.open('No hay cambios para guardar', "Entendido", { duration: 2000 });
    } else {
      for (const extraBranchDish of extraBranchDishesChanged) {
        extraBranchDish.extraBranchId = extraBranchDish.extraBranch.id;
        extraBranchDish.branchDishId = extraBranchDish.branchDish.id;
      }
      this.snackBar.open('Actualizando extras en plato en sede');
      this.savingExtraBranchDish = true;
      this.extraService.bulkSave({ extraBranchDishes: extraBranchDishesChanged, socketId: this.socket.id! }).subscribe({
        next: (response) => {
          this.savingExtraBranchDish = false;
          this.extraBranchDishes = this.extraBranchDishes.map(extraBranchDish => {
            const match = response.extraBranchDishes.find(ebd => ebd.branchDish.id === extraBranchDish.branchDish.id && ebd.extraBranch.id === extraBranchDish.extraBranch.id);
            return match ? match : extraBranchDish;
          });
        },
        error: (error: ErrorMessage) => {
          this.snackBar.openFromComponent(ErrorSnackBar, {
            data: {
              messages: error.message
            },
            duration: 2000
          });
          this.savingExtraBranchDish = false;
        }
      });
    }
  }
}
