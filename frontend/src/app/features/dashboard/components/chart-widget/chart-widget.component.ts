import { Component, Input } from '@angular/core';
import { ProductionPoint } from '../../../../models';

@Component({
  standalone: false,
  selector: 'app-chart-widget',
  templateUrl: './chart-widget.component.html',
  styleUrl: './chart-widget.component.scss'
})
export class ChartWidgetComponent {
  @Input() data: ProductionPoint[] = [];
}
