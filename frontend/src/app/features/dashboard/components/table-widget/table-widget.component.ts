import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProductionPoint } from '../../../../models';
import {
  selectProductionData,
  selectProductionLoading,
} from '../../../../state/production-data/production-data.selectors';
import { Store } from '@ngrx/store';

@Component({
  standalone: false,
  selector: 'app-table-widget',
  templateUrl: './table-widget.component.html',
  styleUrls: ['./table-widget.component.scss'],
})
export class TableWidgetComponent {
  productionData$;
  loading$;

  constructor(private store: Store) {
    this.productionData$ = this.store.select(selectProductionData);
    this.loading$ = this.store.select(selectProductionLoading);
  }

  dataSource = new MatTableDataSource<ProductionPoint>();
  displayedColumns: string[] = [
    'timestamp',
    'oil_rate',
    'pressure',
    'temperature',
  ];

  ngOnInit() {
    this.productionData$.subscribe((data: ProductionPoint[]) => {
      this.dataSource.data = data;
    });
  }
}
