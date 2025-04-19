import { Component, Input } from '@angular/core';
import { ProductionPoint } from '../../../../models';

@Component({
  standalone: false,
  selector: 'app-table-widget',
  templateUrl: './table-widget.component.html',
  styleUrl: './table-widget.component.scss'
})
export class TableWidgetComponent {
  @Input() data: ProductionPoint[] = [];
}
