import { Component } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ProductionPoint } from '../../../../models';
import {
  selectProductionData,
  selectProductionLoading,
} from '../../../../state/production-data/production-data.selectors';
import { Store } from '@ngrx/store';

@Component({
  standalone: false,
  selector: 'app-chart-widget',
  templateUrl: './chart-widget.component.html',
  styleUrls: ['./chart-widget.component.scss'],
})
export class ChartWidgetComponent {
  productionData$;
  loading$;
  data: ProductionPoint[] = [];

  constructor(private store: Store) {
    this.productionData$ = this.store.select(selectProductionData);
    this.loading$ = this.store.select(selectProductionLoading);
  }

  chartOptions: EChartsOption = {};

  ngOnInit() {
    this.productionData$.subscribe((data) => {
      this.data = data;
      this.updateChart();
    });
  }

  updateChart(): void {
    this.chartOptions = {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'time',
        name: 'Timestamp',
      },
      yAxis: {
        type: 'value',
        name: 'Oil Rate (bbl/day)',
      },
      series: [
        {
          name: 'Oil Rate',
          type: 'line',
          smooth: true,
          data: this.data.map((point) => [point.timestamp, point.oil_rate]),
        },
      ],
    };
  }
}
