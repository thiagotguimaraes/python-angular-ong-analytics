import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ProductionPoint, Well } from '../../../models'

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
	private apiUrl = 'http://localhost:8000' // Replace with actual backend base URL

	constructor(private http: HttpClient) {}

	getWells(): Observable<Well[]> {
		return this.http.get<Well[]>(`${this.apiUrl}/wells`)
	}

	getProductionData(
		collection: string,
		start_ms: number | null | undefined = null,
		end_ms: number | null | undefined = null
	): Observable<ProductionPoint[]> {
		if (!start_ms || !end_ms) {
			console.warn('!!!!!  TO BE FIXED !!!!!! No start or end time provided, mocking it')
			start_ms = 1738526400000
			end_ms = 1743451200000
		}
		return this.http.get<ProductionPoint[]>(`${this.apiUrl}/data`, {
			params: {
				well: collection,
				...(start_ms !== null && start_ms !== undefined && { start_ms: start_ms.toString() }),
				...(end_ms !== null && end_ms !== undefined && { end_ms: end_ms.toString() }),
			},
		})
	}
}
