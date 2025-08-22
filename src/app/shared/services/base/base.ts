import { Injectable } from '@angular/core';
import {environment} from '../../../../environment/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Base<T> {
  basePath: string = environment.apiUrl;

  constructor(public http: HttpClient) { }

  handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error.error);
  }
}
