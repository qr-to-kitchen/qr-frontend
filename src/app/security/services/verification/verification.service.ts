import { Injectable } from '@angular/core';
import {Base} from '../../../shared/services/base/base';
import {HttpClient} from '@angular/common/http';
import {VerificationDto} from '../../models/verification.dto';
import {catchError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationService extends Base<{ message: string }>{

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'users';
  }

  sendVerificationCode(verificationDto: VerificationDto) {
    return this.http.post<{ message: string }>(`${this.basePath}/send-verification-code`, verificationDto, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  verifyCode(verificationDto: VerificationDto) {
    return this.http.post<{ message: string }>(`${this.basePath}/verify-code`, verificationDto, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  resetPassword(verificationDto: VerificationDto) {
    return this.http.post<{ message: string }>(`${this.basePath}/reset-password`, verificationDto, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }
}
