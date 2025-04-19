import { Component } from '@angular/core';
import { ProductionPoint } from '../../../models';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  productionData: ProductionPoint[] = [];

  onDataFetched(data: ProductionPoint[]) {
    this.productionData = data;
  }
}
