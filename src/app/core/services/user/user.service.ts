import { Injectable } from '@angular/core';
import {Base} from '../../../shared/services/base/base';
import {UserApiResponse} from '../../models/api-responses/user-api-response';
import {HttpClient} from '@angular/common/http';
import {UserDto} from '../../models/user.dto';
import {catchError, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService extends Base<UserApiResponse>{

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'users';
  }

  update(id: number, body: UserDto): Observable<UserApiResponse> {
    return this.http.put<UserApiResponse>(`${this.basePath}/${id}`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }
}
