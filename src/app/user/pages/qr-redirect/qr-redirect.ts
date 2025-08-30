import {Component, OnInit} from '@angular/core';
import {QrService} from '../../services/qr/qr.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ErrorSnackBar} from '../../../shared/pages/error-snack-bar/error-snack-bar';
import {MatSnackBar} from '@angular/material/snack-bar';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-qr-redirect',
  standalone: false,
  templateUrl: './qr-redirect.html',
  styleUrl: './qr-redirect.css'
})
export class QrRedirect implements OnInit {
  loading: boolean = true;

  qrId: string = '';

  constructor(private qrService: QrService, private route: ActivatedRoute,
              private snackBar: MatSnackBar,  private router: Router,) { }

  async ngOnInit(): Promise<void> {
    this.qrId = this.route.snapshot.params['qrId'];
    try {
      const qrApiResponse =  await firstValueFrom(this.qrService.getById(this.qrId));

      sessionStorage.setItem('branchId', qrApiResponse.qr.branchId.toString());
      sessionStorage.setItem('tableNumber', qrApiResponse.qr.tableNumber.toString());
      this.router.navigate([`/menu/${qrApiResponse.qr.branchId}/${qrApiResponse.qr.tableNumber}`], { replaceUrl: true }).then();
    } catch (error: any) {
      this.snackBar.openFromComponent(ErrorSnackBar, {
        data: {
          messages: error.message
        },
        duration: 2000
      });
      this.loading = false;
    }
  }
}
