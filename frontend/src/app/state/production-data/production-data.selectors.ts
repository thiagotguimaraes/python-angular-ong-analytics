import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductionDataState } from './production-data.reducer';

export const selectProductionState =
  createFeatureSelector<ProductionDataState>('productionData');

export const selectProductionData = createSelector(
  selectProductionState,
  (state) => state.data
);

export const selectProductionLoading = createSelector(
  selectProductionState,
  (state) => state.loading
);
