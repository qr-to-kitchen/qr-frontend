import {Component, Input, OnInit} from '@angular/core';
import {UserDto} from '../../models/user.dto';
import {BranchDto} from '../../models/branch.dto';
import {UserService} from '../../services/user/user.service';
import {BranchService} from '../../services/branch/branch.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {firstValueFrom} from 'rxjs';
import {ErrorMessage} from '../../../shared/models/error-message';

@Component({
  selector: 'app-profile-branch',
  standalone: false,
  templateUrl: './profile-branch.html',
  styleUrl: './profile-branch.css'
})
export class ProfileBranch implements OnInit {
  @Input() role: string = '';

  user: UserDto = {} as UserDto;
  userToUpdate: UserDto = {} as UserDto;
  branch: BranchDto = {} as BranchDto;
  branchToUpdate: BranchDto = {} as BranchDto;

  dataLoaded: boolean = false;
  userProfileSaving: boolean = false;
  branchSaving: boolean = false;

  constructor(private userService: UserService, private branchService: BranchService,
              private snackBar: MatSnackBar, private router: Router,) { }

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('token')) {
      try {
        const userApiResponse =  await firstValueFrom(this.userService.getObject());
        if (userApiResponse.user.role === "BRANCH") {
          this.user = userApiResponse.user;
          this.userToUpdate = {...userApiResponse.user};

          const branchApiResponse =  await firstValueFrom(this.branchService.getObject());
          this.branch = branchApiResponse.branch;
          this.branchToUpdate = {...branchApiResponse.branch};

          this.dataLoaded = true;
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

  onUpdateUser() {
    this.snackBar.open('Actualizando usuario');
    this.userProfileSaving = true;
    this.userService.update(this.userToUpdate.id, this.userToUpdate).subscribe({
      next: (response) => {
        this.snackBar.open("Perfil actualizado con éxito", "Entendido", {duration: 2000});
        this.userProfileSaving = false;
        this.user = response.user;
        this.userToUpdate = {...response.user};
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.userProfileSaving = false;
      }
    });
  }

  onUpdateBranch() {
    this.snackBar.open('Actualizando sede');
    this.branchSaving = true;
    this.branchService.update(this.branchToUpdate.id, this.branchToUpdate).subscribe({
      next: (response) => {
        this.snackBar.open("Sede actualizada con éxito", "Entendido", {duration: 2000});
        this.branchSaving = false;
        this.branch = response.branch;
        this.branchToUpdate = {...response.branch};
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.branchSaving = false;
      }
    });
  }
}
