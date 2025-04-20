import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { MatSnackBar } from '@angular/material/snack-bar'
import { BehaviorSubject, interval, catchError, of, switchMap, tap } from 'rxjs'

export const API_URL = 'http://localhost:8000'

@Injectable({ providedIn: 'root' })
export class BackendStatusService {
	private isOnline$ = new BehaviorSubject<boolean>(true)

	constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

	init(): void {
		interval(5000) // ping every 5 seconds
			.pipe(
				switchMap(() =>
					this.http.get<{ status: string }>(`${API_URL}/health`).pipe(
						catchError(() => of({ status: 'error' })) // Return 'error' if the request fails
					)
				),
				tap((res) => {
					const currentlyOnline = res.status === 'ok' // Check if the status is 'ok'
					const previouslyOnline = this.isOnline$.value

					// Only notify on transition (online <-> offline)
					if (!currentlyOnline && previouslyOnline) {
						this.snackBar.open('⚠️ Backend is offline', 'Dismiss', {
							duration: 15000000,
							panelClass: ['snackbar-error'],
							verticalPosition: 'top',
						})
					}

					if (currentlyOnline && !previouslyOnline) {
						this.snackBar.open('✅ Backend is back online', '', {
							duration: 3000,
							panelClass: ['snackbar-success'],
							verticalPosition: 'top',
						})
					}

					this.isOnline$.next(currentlyOnline)
				})
			)
			.subscribe()
	}

	status$ = this.isOnline$.asObservable()
}
