import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DashboardDataService } from '../../features/dashboard/services/dashboard-data.service';
import * as ProductionActions from './production-data.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';

@Injectable()
export class ProductionDataEffects {
  loadProductionData$: any; 

  constructor(
    private actions$: Actions, // must be injected like this
    private dataService: DashboardDataService
  ) {
    console.log('[EFFECT CONSTRUCTOR] actions$ is:', this.actions$);
    console.log('[EFFECT CONSTRUCTOR] dataService is:', this.dataService);
    
    this.loadProductionData$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductionActions.loadProductionData),
        tap(({ collection }) => console.log('[EFFECT] Loading for:', collection)),
        mergeMap(({ collection }) =>
          this.dataService.getProductionData(collection).pipe(
            tap(data => console.log('[EFFECT] Got data:', data)),
            map(data => ProductionActions.loadProductionDataSuccess({ data })),
            catchError(error =>
              of(ProductionActions.loadProductionDataFailure({ error }))
            )
          )
        )
      )
    );
  }

}
