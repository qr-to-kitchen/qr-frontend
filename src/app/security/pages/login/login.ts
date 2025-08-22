import {Component, OnInit} from '@angular/core';
import {LoginDto} from '../../models/login.dto';
import {LoginService} from '../../services/login/login.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorMessage} from '../../../shared/models/error-message';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {Router} from '@angular/router';
import {UserService} from '../../../core/services/user/user.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  loginDto: LoginDto = {} as LoginDto;

  constructor(private loginService: LoginService, private userService: UserService,
              private snackBar: MatSnackBar, private router: Router,) { }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.userService.getObject().subscribe({
        next: (response) => {
          this.router.navigate(['/home', response.user.role]).then();
        },
        error: (error: ErrorMessage) => {
          localStorage.clear();
          this.snackBar.openFromComponent(ErrorSnackBar, {
            data: {
              messages: error.message
            },
            duration: 2000
          });
        }
      });
    }
  }

  onSubmit() {
    this.snackBar.open('Iniciando sesión');
    this.loginService.login(this.loginDto).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        localStorage.setItem('token', response.token);
        this.router.navigate(['/home', response.role]).then();
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
      }
    });
  }
}
