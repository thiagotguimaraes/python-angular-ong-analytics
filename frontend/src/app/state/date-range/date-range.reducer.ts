import { createReducer, on } from '@ngrx/store'
import * as DateRangeActions from './date-range.actions'

export interface DateRangeState {
	start_ms: number | null | undefined
	end_ms: number | null | undefined
}

export const initialState: DateRangeState = {
	start_ms: null,
	end_ms: null,
}

export const dateRangeReducer = createReducer(
	initialState,
	on(DateRangeActions.setDateRange, (state, { start_ms, end_ms }) => ({ start_ms, end_ms })),
	on(DateRangeActions.clearDateRange, () => ({ start_ms: null, end_ms: null }))
)
