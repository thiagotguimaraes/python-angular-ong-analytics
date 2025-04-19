import { Component } from '@angular/core';
import { FilterDrawerComponent } from "../components/filter-drawer/filter-drawer.component";
import { ChartWidgetComponent } from "../components/chart-widget/chart-widget.component";
import { TableWidgetComponent } from "../components/table-widget/table-widget.component";

@Component({
  selector: 'app-dashboard',
  imports: [FilterDrawerComponent, ChartWidgetComponent, TableWidgetComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
