import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductionPoint, Well } from '../../../models';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private apiUrl = 'http://localhost:8000'; // Replace with actual backend base URL

  constructor(private http: HttpClient) {}

  getWells(): Observable<Well[]> {
    return this.http.get<Well[]>(`${this.apiUrl}/wells`);
  }

  getProductionData(collection: string, start_ms: number, end_ms: number): Observable<ProductionPoint[]> {
    return this.http.get<ProductionPoint[]>(`${this.apiUrl}/data`, {
      params: {
        well: collection,
        start_ms,
        end_ms
      }
    });
  }
  
}
