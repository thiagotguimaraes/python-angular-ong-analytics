import { createAction, props } from '@ngrx/store'
import { Well } from '../../models'

export const selectWell = createAction('[Map] Select Well', props<{ well: Well }>())

export const clearSelectedWell = createAction('[Map] Clear Selected Well')
