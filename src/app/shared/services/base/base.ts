import { Injectable } from '@angular/core';
import {environment} from '../../../../environment/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {RestaurantApiResponse} from '../../../core/models/api-responses/restaurant-api-response';

@Injectable({
  providedIn: 'root'
})
export class Base<T> {
  basePath: string = environment.apiUrl;

  constructor(public http: HttpClient) { }

  handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error.error);
  }

  getObject(): Observable<T> {
    return this.http.get<T>(`${this.basePath}/my`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(catchError(this.handleError));
  }

  getAll(): Observable<RestaurantApiResponse> {
    return this.http.get<RestaurantApiResponse>(`${this.basePath}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }
}
