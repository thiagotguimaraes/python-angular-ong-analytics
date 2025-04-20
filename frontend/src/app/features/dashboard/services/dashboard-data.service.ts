import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { ProductionPoint, Well } from '../../../models'
import { API_URL } from '../../../core/services/backend-status.service'

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
	constructor(private http: HttpClient) {}

	getWells(): Observable<Well[]> {
		return this.http.get<Well[]>(`${API_URL}/wells`).pipe(
			catchError((error) => {
				console.error('Error fetching wells:', error)
				// Return an empty array as a fallback
				return of([])
			})
		)
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
		return this.http
			.get<ProductionPoint[]>(`${API_URL}/data`, {
				params: {
					well: collection,
					...(start_ms !== null && start_ms !== undefined && { start_ms: start_ms.toString() }),
					...(end_ms !== null && end_ms !== undefined && { end_ms: end_ms.toString() }),
				},
			})
			.pipe(
				catchError((error) => {
					console.error('Error fetching production data:', error)
					// Return an empty array as a fallback
					return of([])
				})
			)
	}
}
