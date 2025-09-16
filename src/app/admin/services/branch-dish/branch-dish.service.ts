import { Injectable } from '@angular/core';
import {Base} from '../../../shared/services/base/base';
import {BranchDishApiResponse} from '../../models/api-responses/branch-dish-api-response';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {BranchDishDto} from '../../models/branch-dish.dto';
import {BulkSaveBranchDishesDto} from '../../models/bulk-save-branch-dishes.dto';

@Injectable({
  providedIn: 'root'
})
export class BranchDishService extends Base<BranchDishApiResponse> {

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'branches-dishes';
  }

  getBranchDishAvailabilityInBranches(restaurantId: number, dishId: number): Observable<BranchDishApiResponse> {
    return this.http.get<BranchDishApiResponse>(`${this.basePath}/restaurant/${restaurantId}/dish/${dishId}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  getByBranchId(branchId: number): Observable<BranchDishApiResponse> {
    return this.http.get<BranchDishApiResponse>(`${this.basePath}/branch/${branchId}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }


  getByBranchIdAndCategoryId(branchId: number, categoryId: number): Observable<BranchDishApiResponse> {
    return this.http.get<BranchDishApiResponse>(`${this.basePath}/branch/${branchId}/category/${categoryId}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  getByRestaurantIdAndNoBranchId(restaurantId: number, branchId: number): Observable<BranchDishApiResponse> {
    return this.http.get<BranchDishApiResponse>(`${this.basePath}/restaurant/${restaurantId}/no-branch/${branchId}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  create(body: BranchDishDto): Observable<BranchDishApiResponse> {
    return this.http.post<BranchDishApiResponse>(`${this.basePath}`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  update(id: number, body: BranchDishDto): Observable<BranchDishApiResponse> {
    return this.http.put<BranchDishApiResponse>(`${this.basePath}/${id}`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  bulkSave(body: BulkSaveBranchDishesDto): Observable<BranchDishApiResponse> {
    return this.http.post<BranchDishApiResponse>(`${this.basePath}/bulk-save`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }
}
