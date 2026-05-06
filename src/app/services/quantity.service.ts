import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { QuantityInputDTO, QuantityMeasurementResult } from '../models/models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class QuantityService {
  private apiUrl = `${environment.apiUrl}/quantities`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  compare(input: QuantityInputDTO): Observable<QuantityMeasurementResult> {
    return this.http.post<QuantityMeasurementResult>(`${this.apiUrl}/compare`, input, { headers: this.authHeaders() });
  }

  convert(input: QuantityInputDTO): Observable<QuantityMeasurementResult> {
    return this.http.post<QuantityMeasurementResult>(`${this.apiUrl}/convert`, input, { headers: this.authHeaders() });
  }

  add(input: QuantityInputDTO): Observable<QuantityMeasurementResult> {
    return this.http.post<QuantityMeasurementResult>(`${this.apiUrl}/add`, input, { headers: this.authHeaders() });
  }

  subtract(input: QuantityInputDTO): Observable<QuantityMeasurementResult> {
    return this.http.post<QuantityMeasurementResult>(`${this.apiUrl}/subtract`, input, { headers: this.authHeaders() });
  }

  divide(input: QuantityInputDTO): Observable<QuantityMeasurementResult> {
    return this.http.post<QuantityMeasurementResult>(`${this.apiUrl}/divide`, input, { headers: this.authHeaders() });
  }

  getHistory(): Observable<QuantityMeasurementResult[]> {
    const headers = this.authHeaders();
    console.log('Making history request with headers:', headers);
    return this.http.get<QuantityMeasurementResult[]>(`${this.apiUrl}/history`, {
      headers: headers
    });
  }

  getHistoryByOperation(op: string): Observable<QuantityMeasurementResult[]> {
    return this.http.get<QuantityMeasurementResult[]>(`${this.apiUrl}/history/${op}`, {
      headers: this.authHeaders()
    });
  }

  getOperationCount(op: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/${op}`, {
      headers: this.authHeaders()
    });
  }

  private authHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    console.log('Auth token:', token ? 'present' : 'missing');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}
