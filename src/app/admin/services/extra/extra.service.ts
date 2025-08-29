import { Injectable } from '@angular/core';
import {Base} from '../../../shared/services/base/base';
import {ExtraApiResponse} from '../../models/api-responses/extra-api-response';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {ExtraDto} from '../../models/extra.dto';
import {ExtraBranchDto} from '../../models/extra-branch.dto';
import {ExtraBranchDishDto} from '../../models/extra-branch-dish.dto';

@Injectable({
  providedIn: 'root'
})
export class ExtraService extends Base<ExtraApiResponse>{

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'extras';
  }

  getByRestaurantId(id: number): Observable<ExtraApiResponse> {
    return this.http.get<ExtraApiResponse>(`${this.basePath}/restaurant/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  getExtraBranchByBranchId(id: number): Observable<ExtraApiResponse> {
    return this.http.get<ExtraApiResponse>(`${this.basePath}/extraBranch/branch/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  update(id: number, body: ExtraDto): Observable<ExtraApiResponse> {
    return this.http.put<ExtraApiResponse>(`${this.basePath}/${id}`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  create(body: ExtraDto): Observable<ExtraApiResponse> {
    return this.http.post<ExtraApiResponse>(`${this.basePath}`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  getExtraBranchByExtraIdAndBranchId(extraId: number, branchId: number): Observable<ExtraApiResponse> {
    return this.http.get<ExtraApiResponse>(`${this.basePath}/extra/${extraId}/branch/${branchId}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  getExtraBranchDishByExtraBranchIdAndBranchDishId(extraBranchId: number, branchDishId: number): Observable<ExtraApiResponse> {
    return this.http.get<ExtraApiResponse>(`${this.basePath}/extraBranch/${extraBranchId}/branchDish/${branchDishId}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  getExtraBranchDishByBranchDishId(branchDishId: number): Observable<ExtraApiResponse> {
    return this.http.get<ExtraApiResponse>(`${this.basePath}/extraBranchDish/branchDish/${branchDishId}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  createExtraBranch(body: ExtraBranchDto): Observable<ExtraApiResponse> {
    return this.http.post<ExtraApiResponse>(`${this.basePath}/branch`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  createExtraBranchDish(body: ExtraBranchDishDto): Observable<ExtraApiResponse> {
    return this.http.post<ExtraApiResponse>(`${this.basePath}/branch-dish`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  updateExtraBranchDish(id: number, body: ExtraBranchDishDto): Observable<ExtraApiResponse> {
    return this.http.put<ExtraApiResponse>(`${this.basePath}/branch-dish/${id}`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }
}
