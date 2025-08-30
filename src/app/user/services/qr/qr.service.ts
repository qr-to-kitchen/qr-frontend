import { Injectable } from '@angular/core';
import {Base} from '../../../shared/services/base/base';
import {QrApiResponse} from '../../models/api-responses/qr-api-response';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {QrDto} from '../../models/qr.dto';

@Injectable({
  providedIn: 'root'
})
export class QrService extends Base<QrApiResponse>{

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'qr';
  }

  create(body: QrDto): Observable<QrApiResponse> {
    return this.http.post<QrApiResponse>(`${this.basePath}`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  getById(id: string): Observable<QrApiResponse> {
    return this.http.get<QrApiResponse>(`${this.basePath}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }
}
