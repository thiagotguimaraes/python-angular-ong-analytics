import { createAction, props } from '@ngrx/store';

export const selectWell = createAction(
  '[Map] Select Well',
  props<{ well: { name: string; latitude: number; longitude: number } }>()
);

export const clearSelectedWell = createAction('[Map] Clear Selected Well');
