import { createReducer, on } from '@ngrx/store';
import * as ProductionActions from './production-data.actions';
import { ProductionPoint } from '../../models';

export interface ProductionDataState {
  data: ProductionPoint[]; // shape of your production records
  loading: boolean;
  error: any;
}

export const initialState: ProductionDataState = {
  data: [],
  loading: false,
  error: null
};

export const productionDataReducer = createReducer(
  initialState,
  on(ProductionActions.loadProductionData, state => ({ ...state, loading: true })),
  on(ProductionActions.loadProductionDataSuccess, (state, { data }) => {
    return {
      ...state,
      data,
      loading: false
    };
  }),
  on(ProductionActions.loadProductionDataFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
