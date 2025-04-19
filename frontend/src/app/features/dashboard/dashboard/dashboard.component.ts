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
  wellLocations = [

    { name: 'Well A', lat: 24.466667, lon: 54.366669 },
    { name: 'Well B', lat: 25.276987, lon: 55.296249 }
  ];
  // 1 | Well 1 | well_1     | 24.466667 | 54.366669
  // 2 | Well 2 | well_2     | 25.276987 | 55.296249
  // 3 | Well 3 | well_3     | 25.405216 | 55.513643
  

  onDataFetched(data: ProductionPoint[]) {
    this.productionData = data;
  }
}
