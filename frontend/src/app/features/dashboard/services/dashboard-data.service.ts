import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Well {
  name: string;
  collection: string;
  latitude: number;
  longitude: number;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private apiUrl = 'http://localhost:8000'; // Replace with actual backend base URL

  constructor(private http: HttpClient) {}

  getWells(): Observable<Well[]> {
    return this.http.get<Well[]>(`${this.apiUrl}/wells`);
  }
}
