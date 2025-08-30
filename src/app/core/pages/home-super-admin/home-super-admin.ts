import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-super-admin',
  standalone: false,
  templateUrl: './home-super-admin.html',
  styleUrl: './home-super-admin.css'
})
export class HomeSuperAdmin implements OnInit {
  @Input() role: string = '';

  constructor(private userService: UserService, private snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.userService.getObject().subscribe({
        next: (response) => {
          if (response.user.role === "SUPER_ADMIN") {

          } else {
            localStorage.clear();
            this.snackBar.open("Vuelva a iniciar sesión", "Entendido", {duration: 2000});
            this.router.navigate(['/login']).then();
          }
        },
        error: () => {
          localStorage.clear();
          this.snackBar.open("Vuelva a iniciar sesión", "Entendido", {duration: 2000});
          this.router.navigate(['/login']).then();
        }
      });
    } else {
      localStorage.clear();
      this.snackBar.open("Vuelva a iniciar sesión", "Entendido", {duration: 2000});
      this.router.navigate(['/login']).then();
    }
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['/login']).then();
  }
}
