import {Component, OnInit} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {UserService} from '../../../core/services/user/user.service';
import {QrService} from '../../../user/services/qr/qr.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {QrDto} from '../../../user/models/qr.dto';
import {ErrorMessage} from '../../../shared/models/error-message';

@Component({
  selector: 'app-create-qr',
  standalone: false,
  templateUrl: './create-qr.html',
  styleUrl: './create-qr.css'
})
export class CreateQr implements OnInit {
  creating: boolean = false;
  qrCreated: boolean = false;

  qr: QrDto = {} as QrDto;

  qrSrc: string = '';

  constructor(private userService: UserService, private qrService: QrService,
              private snackBar: MatSnackBar, private router: Router,) { }

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('token')) {
      try {
        const userApiResponse =  await firstValueFrom(this.userService.getObject());
        if (userApiResponse.user.role === "SUPER_ADMIN") {

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

  createQR() {
    this.snackBar.open('Creando QR');
    this.creating = true;
    this.qrService.create(this.qr).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.creating = false;
        this.qrCreated = true;
        this.qrSrc = response.qrCode;
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.creating = false;
        this.qrCreated = false;
        this.qrSrc = '';
      }
    });
  }

  regenerateQR() {
    this.snackBar.open('Re-generando QR');
    this.creating = true;
    this.qrService.regenerateById(this.qr).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.creating = false;
        this.qrCreated = true;
        this.qrSrc = response.qrCode;
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        this.creating = false;
        this.qrCreated = false;
        this.qrSrc = '';
      }
    });
  }

  onTabChange() {
    this.creating = false;
    this.qrCreated = false;

    this.qr = {} as QrDto;

    this.qrSrc = '';
  }
}
