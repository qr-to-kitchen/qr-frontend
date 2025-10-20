import { Injectable } from '@angular/core';
import {Base} from "../../../shared/services/base/base";
import {ConfigurationApiResponse} from "../../models/api-responses/configuration-api-response";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService extends Base<ConfigurationApiResponse>{

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'configuration';
  }

  getByBranchId(id: number): Observable<ConfigurationApiResponse> {
    return this.http.get<ConfigurationApiResponse>(`${this.basePath}/branch/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }
}
