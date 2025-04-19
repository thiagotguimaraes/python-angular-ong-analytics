import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FilterDrawerComponent } from "./components/filter-drawer/filter-drawer.component";
import { ChartWidgetComponent } from "./components/chart-widget/chart-widget.component";
import { TableWidgetComponent } from "./components/table-widget/table-widget.component";
import { MapWidgetComponent } from './components/map-widget/map-widget.component';
import { RouterModule, Routes } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule  } from '@angular/material/sidenav';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    FilterDrawerComponent,
    TableWidgetComponent,
    ChartWidgetComponent,
    MapWidgetComponent
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatSidenavModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
})
export class DashboardModule {}
