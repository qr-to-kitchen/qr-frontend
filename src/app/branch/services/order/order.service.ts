import { Injectable } from '@angular/core';
import {Base} from '../../../shared/services/base/base';
import {OrderApiResponse} from '../../api-responses/order-api-response';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends Base<OrderApiResponse>{

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'orders';
  }

  getByBranchId(id: number): Observable<OrderApiResponse> {
    return this.http.get<OrderApiResponse>(`${this.basePath}/branch/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  getByBranchIdAndPage(id: number, page: number): Observable<OrderApiResponse> {
    return this.http.get<OrderApiResponse>(`${this.basePath}/branch/${id}/${page}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  updateStatus(id: number, status: string): Observable<OrderApiResponse> {
    return this.http.put<OrderApiResponse>(`${this.basePath}/${id}`, { status: status }, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }
}
