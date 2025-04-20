import { createAction, props } from '@ngrx/store'

export const setDateRange = createAction(
	'[Filter] Set Date Range',
	props<{ start_ms: number | null; end_ms: number | null }>()
)

export const clearDateRange = createAction('[Filter] Clear Date Range')
