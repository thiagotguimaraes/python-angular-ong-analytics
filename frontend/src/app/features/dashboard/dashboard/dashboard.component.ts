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
    });
  }
  

  onDataFetched(data: ProductionPoint[]) {
    this.productionData = data;
  }
}
