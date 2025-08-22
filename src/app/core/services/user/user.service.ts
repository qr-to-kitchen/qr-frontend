import { Injectable } from '@angular/core';
import {Base} from '../../../shared/services/base/base';
import {UserApiResponse} from '../../models/api-responses/user-api-response';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService extends Base<UserApiResponse>{

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'users';
  }
}
