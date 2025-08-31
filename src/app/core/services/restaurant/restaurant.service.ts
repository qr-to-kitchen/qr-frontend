import { Injectable } from '@angular/core';
import {Base} from '../../../shared/services/base/base';
import {RestaurantApiResponse} from '../../models/api-responses/restaurant-api-response';
import {HttpClient} from '@angular/common/http';
import {RestaurantDto} from '../../models/restaurant.dto';
import {catchError, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService extends Base<RestaurantApiResponse>{

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'restaurants';
  }

  update(id: number, body: RestaurantDto): Observable<RestaurantApiResponse> {
    return this.http.put<RestaurantApiResponse>(`${this.basePath}/${id}`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }
}
