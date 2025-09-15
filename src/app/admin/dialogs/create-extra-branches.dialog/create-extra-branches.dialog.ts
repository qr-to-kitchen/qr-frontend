import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {ExtraService} from '../../services/extra/extra.service';
import {firstValueFrom} from 'rxjs';
import {ExtraBranchDto} from '../../models/extra-branch.dto';
import {BranchDto} from '../../../core/models/branch.dto';
import {ErrorMessage} from '../../../shared/models/error-message';
import {io, Socket} from 'socket.io-client';
import {environment} from '../../../../environment/environment';

type CreateExtraBranches = {
  branch: BranchDto;
}

@Component({
  selector: 'app-create-extra-branches.dialog',
  standalone: false,
  templateUrl: './create-extra-branches.dialog.html',
  styleUrl: './create-extra-branches.dialog.css'
})
export class CreateExtraBranchesDialog implements OnInit, OnDestroy {
  dataLoaded: boolean = false;
  savingExtraBranches: boolean = false;

  dataSaved: boolean = false;

  extraBranches: ExtraBranchDto[] = [];

  displayedColumns: string[] = ['add', 'extra', 'actions'];

  socket: Socket;

  constructor(
    private extraService: ExtraService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: CreateExtraBranches,
  ) {
    this.socket = io(environment.sockerUrl, {
      path: environment.production ? '/qr/socket.io' : '/socket.io',
      transports: ['websocket'],
      forceNew: true
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      const extraApiResponse = await firstValueFrom(this.extraService.getExtraBranchByRestaurantIdAndNoBranchId(this.data.branch.restaurant.id, this.data.branch.id));

      for (const extra of extraApiResponse.extras) {
        const extraBranch: ExtraBranchDto = {} as ExtraBranchDto;
        extraBranch.changed = false;
        extraBranch.extra = extra;
        extraBranch.branch = this.data.branch;
        this.extraBranches = [...this.extraBranches, extraBranch];
      }
      this.dataLoaded = true;

      this.socket.on('small-snackbar-updates', (data: { current: number, total: number }) => {
        if (data.current === data.total) {
          this.snackBar.open(`${data.current} de ${data.total} extras en sede actualizados`, "", { duration: 2000 });
        } else {
          this.snackBar.open(`${data.current} de ${data.total} extras en sede actualizados`);
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

  onSaveExtraBranch(e: ExtraBranchDto) {
    e.branchId = e.branch.id;
    e.extraId = e.extra.id;
    this.snackBar.open('Creando nuevo extra en sede');
    this.savingExtraBranches = true;
    this.extraService.createExtraBranch(e).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.savingExtraBranches = false;
        this.extraBranches = this.extraBranches.filter(extraBranch => !(extraBranch.branch.id === response.extraBranch.branch.id && extraBranch.extra.id === response.extraBranch.extra.id));
        this.dataSaved = true;
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.savingExtraBranches = false;
      }
    });
  }

  onSaveExtraBranches() {
    const extraBranchesChanged: ExtraBranchDto[] = this.extraBranches.filter(extraBranch => extraBranch.changed);
    if (extraBranchesChanged.length === 0) {
      this.snackBar.open('No hay cambios para guardar', "Entendido", { duration: 2000 });
    } else {
      for (const extraBranch of extraBranchesChanged) {
        extraBranch.branchId = extraBranch.branch.id;
        extraBranch.extraId = extraBranch.extra.id;
      }
      this.snackBar.open('Actualizando extras en sede');
      this.savingExtraBranches = true;
      this.extraService.bulkSaveExtraBranches({ extraBranches: extraBranchesChanged, socketId: this.socket.id! }).subscribe({
        next: (response) => {
          this.savingExtraBranches = false;
          this.extraBranches = this.extraBranches.filter(extraBranch => {
            const match = response.extraBranches.find(eb => eb.branch.id === extraBranch.branch.id && eb.extra.id === extraBranch.extra.id);
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
          this.savingExtraBranches = false;
        }
      });
    }
  }

  onToggleExtraBranch(e: ExtraBranchDto) {
    e.changed = !e.changed;
  }
}
