import { createReducer, on } from '@ngrx/store'
import { selectWell, clearSelectedWell } from './selected-well.actions'
import { Well } from '../../models'

export interface SelectedWellState {
	well: Well | null
}

export const initialState: SelectedWellState = {
	well: null,
}

export const selectedWellReducer = createReducer(
	initialState,
	on(selectWell, (state, { well }) => ({ ...state, well })),
	on(clearSelectedWell, () => ({ well: null }))
)
