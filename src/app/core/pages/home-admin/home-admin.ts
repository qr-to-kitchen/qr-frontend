import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-home-admin',
  standalone: false,
  templateUrl: './home-admin.html',
  styleUrl: './home-admin.css'
})
export class HomeAdmin implements OnInit {
  @Input() role: string = '';

  constructor(private userService: UserService, private snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.userService.getObject().subscribe({
        next: (response) => {
          if (response.user.role === "ADMIN") {

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
