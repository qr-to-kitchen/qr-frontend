import { Injectable } from '@angular/core';
import {Base} from '../../../shared/services/base/base';
import {BranchApiResponse} from '../../models/api-responses/branch-api-response';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {BranchDto} from '../../models/branch.dto';
import {BranchUserDto} from '../../../admin/models/branch-user.dto';

@Injectable({
  providedIn: 'root'
})
export class BranchService extends Base<BranchApiResponse>{

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'branches';
  }

  update(id: number, body: BranchDto): Observable<BranchApiResponse> {
    return this.http.put<BranchApiResponse>(`${this.basePath}/${id}`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  getByRestaurantId(id: number): Observable<BranchApiResponse> {
    return this.http.get<BranchApiResponse>(`${this.basePath}/restaurant/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  createBranchWithUser(body: BranchUserDto): Observable<BranchApiResponse> {
    return this.http.post<BranchApiResponse>(`${this.basePath}/branch-user`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }
}
