import { Injectable } from '@angular/core';
import {Base} from '../../../shared/services/base/base';
import {CategoryApiResponse} from '../../models/api-responses/category-api-response';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {CategoryDto} from '../../models/category.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends Base<CategoryApiResponse>{

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'categories';
  }

  create(body: CategoryDto): Observable<CategoryApiResponse> {
    return this.http.post<CategoryApiResponse>(`${this.basePath}`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  update(id: number, body: CategoryDto): Observable<CategoryApiResponse> {
    return this.http.put<CategoryApiResponse>(`${this.basePath}/${id}`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  getByRestaurantId(id: number): Observable<CategoryApiResponse> {
    return this.http.get<CategoryApiResponse>(`${this.basePath}/restaurant/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }
}
