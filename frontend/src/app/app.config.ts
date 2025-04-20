import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideHttpClient } from '@angular/common/http'
import { provideRouter } from '@angular/router'
import { provideStore } from '@ngrx/store'
import { selectedWellReducer } from './state/selected-well/selected-well.reducer'
import { productionDataReducer } from './state/production-data/production-data.reducer'
import { dateRangeReducer } from './state/date-range/date-range.reducer'
import { provideEffects } from '@ngrx/effects'
import { ProductionDataEffects } from './state/production-data/production-data.effects'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideHttpClient(),
		provideStore({
			selectedWell: selectedWellReducer,
			productionData: productionDataReducer,
			dateRange: dateRangeReducer,
		}),
		provideEffects([ProductionDataEffects]),
	],
}
