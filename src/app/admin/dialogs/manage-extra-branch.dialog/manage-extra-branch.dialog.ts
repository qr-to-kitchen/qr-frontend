import {Component, Inject, OnInit} from '@angular/core';
import {ExtraBranchDto} from '../../models/extra-branch.dto';
import {ExtraService} from '../../services/extra/extra.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ExtraDto} from '../../models/extra.dto';
import {firstValueFrom} from 'rxjs';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {ErrorMessage} from '../../../shared/models/error-message';
import {ManageExtraBranchDishesDialog} from '../manage-extra-branch-dishes.dialog/manage-extra-branch-dishes.dialog';

type ManageExtra = {
  extra: ExtraDto;
  restaurantId: number;
};

@Component({
  selector: 'app-manage-extra-branch.dialog',
  standalone: false,
  templateUrl: './manage-extra-branch.dialog.html',
  styleUrl: './manage-extra-branch.dialog.css'
})
export class ManageExtraBranchDialog implements OnInit {
  dataLoaded: boolean = false;
  savingExtraBranch: boolean = false;

  extraBranches: ExtraBranchDto[] = [];

  displayedColumns: string[] = ['branch', 'status', 'actions', 'manageDishes'];

  constructor(
    private extraService: ExtraService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ManageExtra,
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      const extraApiResponse =  await firstValueFrom(this.extraService.getExtraBranchAvailabilityInBranches(this.data.restaurantId, this.data.extra.id));

      for (const extraBranch of extraApiResponse.extraBranches) {
        extraBranch.changed = false;
      }
      this.extraBranches = extraApiResponse.extraBranches;
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
  }

  onSaveExtraBranch(e: ExtraBranchDto) {
    e.branchId = e.branch.id;
    e.extraId = e.extra.id;
    this.snackBar.open('Creando nuevo extra en sede');
    this.savingExtraBranch = true;
    this.extraService.createExtraBranch(e).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.savingExtraBranch = false;
        this.extraBranches = this.extraBranches.map(extraBranch => extraBranch.branch.id === response.extraBranch.branch.id && extraBranch.extra.id === response.extraBranch.extra.id ? response.extraBranch : extraBranch);
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.savingExtraBranch = false;
      }
    });
  }

  openManageExtraBranchDishes(extraBranch: ExtraBranchDto) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.maxWidth = '800px';
    dialogConfig.data = {
      extraBranch: extraBranch,
    };

    this.dialog.open(ManageExtraBranchDishesDialog, dialogConfig);
  }
}
