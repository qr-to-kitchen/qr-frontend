import { Injectable } from '@angular/core';
import {Base} from '../../../shared/services/base/base';
import {DishApiResponse} from '../../models/api-responses/dish-api-response';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {DishDto} from '../../models/dish.dto';

@Injectable({
  providedIn: 'root'
})
export class DishService extends Base<DishApiResponse>{

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'dishes';
  }

  create(formData: FormData): Observable<DishApiResponse> {
    return this.http.post<DishApiResponse>(`${this.basePath}`, formData).pipe(catchError(this.handleError));
  }

  update(id: number, body: DishDto): Observable<DishApiResponse> {
    return this.http.put<DishApiResponse>(`${this.basePath}/${id}`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  getByRestaurantId(id: number): Observable<DishApiResponse> {
    return this.http.get<DishApiResponse>(`${this.basePath}/restaurant/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }
}
