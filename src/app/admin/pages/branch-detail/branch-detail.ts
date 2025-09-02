import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {UserService} from '../../../core/services/user/user.service';
import {BranchService} from '../../../core/services/branch/branch.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BranchDto} from '../../../core/models/branch.dto';

@Component({
  selector: 'app-branch-detail',
  standalone: false,
  templateUrl: './branch-detail.html',
  styleUrl: './branch-detail.css'
})
export class BranchDetail implements OnInit {
  branchId: number = 0;

  branch: BranchDto = {} as BranchDto;

  constructor(private userService: UserService, private branchService: BranchService,
              private snackBar: MatSnackBar, private router: Router,
              private route: ActivatedRoute,) { }

  async ngOnInit() {
    if (localStorage.getItem('token')) {
      try {
        const userApiResponse =  await firstValueFrom(this.userService.getObject());
        if (userApiResponse.user.role === "ADMIN") {
          this.branchId = this.route.snapshot.params['branchId'];

          try {
            const branchApiResponse =  await firstValueFrom(this.branchService.getById(this.branchId));

            if (branchApiResponse.branch.restaurant.id === userApiResponse.user.restaurant.id) {

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
}
