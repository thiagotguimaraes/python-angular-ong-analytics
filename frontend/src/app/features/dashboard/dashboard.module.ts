import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgxEchartsModule } from 'ngx-echarts'
import { DashboardComponent } from './dashboard/dashboard.component'
import { ChartWidgetComponent } from './components/chart-widget/chart-widget.component'
import { TableWidgetComponent } from './components/table-widget/table-widget.component'
import { LeafletMapComponent } from './components/leaflet-map/leaflet-map.component'
import { FilterFormComponent } from './components/filter-form/filter-form.component'
import { RouterModule, Routes } from '@angular/router'

import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { MatInputModule } from '@angular/material/input'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { MatButtonModule } from '@angular/material/button'
import { MatSidenavModule } from '@angular/material/sidenav'
import { ReactiveFormsModule } from '@angular/forms'
import { MatTableModule } from '@angular/material/table'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
	},
]

@NgModule({
	declarations: [
		DashboardComponent,
		TableWidgetComponent,
		ChartWidgetComponent,
		LeafletMapComponent,
		FilterFormComponent,
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
		MatToolbarModule,
		MatIconModule,
		ReactiveFormsModule,
		NgxEchartsModule.forRoot({
			echarts: () => import('echarts'),
		}),
	],
})
export class DashboardModule {}
