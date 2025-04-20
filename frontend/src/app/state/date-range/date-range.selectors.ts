import { createFeatureSelector, createSelector } from '@ngrx/store'
import { DateRangeState } from './date-range.reducer'

export const selectDateRangeState = createFeatureSelector<DateRangeState>('dateRange')

export const selectFromDate = createSelector(selectDateRangeState, (state) => state.start_ms)

export const selectToDate = createSelector(selectDateRangeState, (state) => state.end_ms)

export const selectDateRange = createSelector(selectDateRangeState, (state) => ({
	start_ms: state.start_ms,
	end_ms: state.end_ms,
}))
