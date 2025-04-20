import { createFeatureSelector, createSelector } from '@ngrx/store'
import { SelectedWellState } from './selected-well.reducer'

export const selectSelectedWellState = createFeatureSelector<SelectedWellState>('selectedWell')

export const selectSelectedWell = createSelector(selectSelectedWellState, (state) => state.well)
