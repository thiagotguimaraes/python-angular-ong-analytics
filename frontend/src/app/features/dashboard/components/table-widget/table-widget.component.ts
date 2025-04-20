import { Component, Input, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProductionPoint } from '../../../../models'
import { selectProductionData } from '../../../../state/production-data/production-data.selectors';
import { Store } from '@ngrx/store';

@Component({
  standalone: false,
  selector: 'app-table-widget',
  templateUrl: './table-widget.component.html',
  styleUrls: ['./table-widget.component.scss']
})
export class TableWidgetComponent implements OnChanges {
  @Input() data: ProductionPoint[] = [];

  constructor(private store: Store) {}

  dataSource = new MatTableDataSource<ProductionPoint>();
  displayedColumns: string[] = ['timestamp', 'oil_rate', 'pressure', 'temperature'];

  ngOnInit() {
      this.store.select(selectProductionData).subscribe(data => {
        console.log('[CHART] Received production data:', data); // 👈
        this.dataSource.data = data;
      });
    }

  ngOnChanges(): void {
    this.dataSource.data = this.data;
  }
}
