import { Component, OnInit } from '@angular/core';
import { Well } from '../../../models';
import { DashboardDataService } from '../services/dashboard-data.service';
import { Store } from '@ngrx/store';
import { selectWell } from '../../../state/selected-well/selected-well.actions';
import { loadProductionData } from '../../../state/production-data/production-data.actions';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  wells!: Well[];

  constructor(
    private store: Store,
    private dataService: DashboardDataService
  ) {}

  ngOnInit(): void {
    this.dataService.getWells().subscribe((wells: Well[]) => {
      this.wells = wells;

      if (wells.length > 0) {
        const well = wells[0];
        this.store.dispatch(selectWell({ well }));
        this.store.dispatch(
          loadProductionData({
            collection: well.collection,
            start_ms: null,
            end_ms: null,
          })
        );
      }
    });
  }
}
