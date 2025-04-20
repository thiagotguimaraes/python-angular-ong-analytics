import { Component, Input, OnChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ProductionPoint } from '../../../../models';
import { selectProductionData } from '../../../../state/production-data/production-data.selectors';
import { Store } from '@ngrx/store';

@Component({
  standalone: false,
  selector: 'app-chart-widget',
  templateUrl: './chart-widget.component.html',
  styleUrls: ['./chart-widget.component.scss']
})
export class ChartWidgetComponent implements OnChanges {
  constructor(private store: Store) {}

  @Input() data: ProductionPoint[] = [];
  chartOptions: EChartsOption = {};

  ngOnInit() {
    this.store.select(selectProductionData).subscribe(data => {
      this.data = data;
      this.updateChart();
    });
  }

  ngOnChanges(): void {
    this.updateChart();
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
          data: this.data.map(point => [point.timestamp, point.oil_rate]),
        },
      ],
    };
  }
}
