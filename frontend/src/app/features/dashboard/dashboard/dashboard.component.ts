import { Component, OnInit  } from '@angular/core';
import { ProductionPoint, Well } from '../../../models';
import { DashboardDataService } from '../services/dashboard-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  productionData: ProductionPoint[] = [];
  wellLocations: Well[] = [];

  constructor(private dataService: DashboardDataService) {}

  ngOnInit(): void {
    this.dataService.getWells().subscribe((wells: Well[]) => {
      this.wellLocations = wells;
      if (wells.length > 0) {
        this.dataService.getProductionData(wells[0].collection, null, null).subscribe((data: ProductionPoint[]) => {
          this.productionData = data
        });
      }
    });
  }
  

  onDataFetched(data: ProductionPoint[]) {
    this.productionData = data;
  }
}
