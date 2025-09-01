import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../core/services/user/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ExtraService} from '../../services/extra/extra.service';
import {firstValueFrom} from 'rxjs';
import {ErrorMessage} from '../../../shared/models/error-message';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {ExtraDto} from '../../models/extra.dto';
import {Router} from '@angular/router';
import {RestaurantDto} from '../../../core/models/restaurant.dto';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CreateExtraDialog} from '../../dialogs/create-extra.dialog/create-extra.dialog';
import {ManageExtraBranchDialog} from '../../dialogs/manage-extra-branch.dialog/manage-extra-branch.dialog';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'app-manage-extras',
  standalone: false,
  templateUrl: './manage-extras.html',
  styleUrl: './manage-extras.css'
})
export class ManageExtras implements OnInit {
  dataLoaded: boolean = false;
  savingExtra: boolean = false;

  restaurantId: number = 0;

  extras: ExtraDto[] = [];
  extraToEdit: ExtraDto = {} as ExtraDto;

  displayedColumns: string[] = ['name', 'basePrice', 'extraBranches', 'actions'];

  constructor(private userService: UserService, private extraService: ExtraService,
              private snackBar: MatSnackBar, private router: Router,
              private dialog: MatDialog,) {
    this.extraToEdit.restaurant = {} as RestaurantDto;
  }

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('token')) {
      try {
        const userApiResponse =  await firstValueFrom(this.userService.getObject());
        if (userApiResponse.user.role === "ADMIN") {
          this.restaurantId = userApiResponse.user.restaurant.id
          this.extraService.getByRestaurantId(this.restaurantId).subscribe({
            next: (response) => {
              this.extras = response.extras;
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
      extra: {
        restaurantId: this.restaurantId,
      }
    };

    const dialogRef = this.dialog.open(CreateExtraDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result: ExtraDto) => {
      if (result) {
        this.extras = [...this.extras, result];
      }
    });
  }

  openEditDrawer(editDrawer: MatSidenav, extra: ExtraDto) {
    editDrawer.open().then();
    this.extraToEdit = {...extra};
  }

  manageExtra(extra: ExtraDto) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.maxWidth = '850px';
    dialogConfig.data = {
      extra: extra,
      restaurantId: this.restaurantId,
    };

    this.dialog.open(ManageExtraBranchDialog, dialogConfig);
  }

  onUpdateExtra(editDrawer: MatSidenav) {
    this.snackBar.open('Actualizando extra');
    this.savingExtra = true;
    this.extraService.update(this.extraToEdit.id, this.extraToEdit).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.savingExtra = false;
        this.extras = this.extras.map(extra => extra.id === response.extra.id ? response.extra : extra);
        editDrawer.close().then();
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.savingExtra = false;
      }
    });
  }
}
