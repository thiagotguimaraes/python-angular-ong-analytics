import { createAction, props } from '@ngrx/store'
import { ProductionPoint } from '../../models'

export const loadProductionData = createAction(
	'[Production] Load Data',
	props<{ collection: string; start_ms: number; end_ms: number }>()
)

export const loadProductionDataSuccess = createAction(
	'[Production] Load Data Success',
	props<{ data: ProductionPoint[] }>() // adjust shape as needed
)

export const loadProductionDataFailure = createAction('[Production] Load Data Failure', props<{ error: any }>())
