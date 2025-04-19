import { Component, Input, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProductionPoint } from '../../../../models'

@Component({
  standalone: false,
  selector: 'app-table-widget',
  templateUrl: './table-widget.component.html',
  styleUrls: ['./table-widget.component.scss']
})
export class TableWidgetComponent implements OnChanges {
  @Input() data: ProductionPoint[] = [];

  dataSource = new MatTableDataSource<ProductionPoint>();
  displayedColumns: string[] = ['timestamp', 'oil_rate', 'pressure', 'temperature'];

  ngOnChanges(): void {
    this.dataSource.data = this.data;
  }
}
