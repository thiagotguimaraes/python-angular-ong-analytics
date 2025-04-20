import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DashboardDataService } from '../../features/dashboard/services/dashboard-data.service';
import * as ProductionActions from './production-data.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';

@Injectable()
export class ProductionDataEffects {
  loadProductionData$: any; 

  constructor(
    private actions$: Actions,
    private dataService: DashboardDataService
  ) {
    
    this.loadProductionData$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductionActions.loadProductionData),
        mergeMap(({ collection }) =>
          this.dataService.getProductionData(collection).pipe(
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
