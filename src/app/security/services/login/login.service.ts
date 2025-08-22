import { Injectable } from '@angular/core';
import {Base} from '../../../shared/services/base/base';
import {LoginApiResponse} from '../../models/api-responses/login-api-response';
import {HttpClient} from '@angular/common/http';
import {LoginDto} from '../../models/login.dto';
import {catchError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends Base<LoginApiResponse>{

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'users/login';
  }

  login(loginDto: LoginDto) {
    return this.http.post<LoginApiResponse>(this.basePath, loginDto, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }
}
