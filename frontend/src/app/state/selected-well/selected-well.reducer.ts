import { createReducer, on } from '@ngrx/store';
import { selectWell, clearSelectedWell } from './selected-well.actions';

export interface SelectedWellState {
  well: { name: string; latitude: number; longitude: number } | null;
}

export const initialState: SelectedWellState = {
  well: null,
};

export const selectedWellReducer = createReducer(
  initialState,
  on(selectWell, (state, { well }) => ({ ...state, well })),
  on(clearSelectedWell, () => ({ well: null }))
);
