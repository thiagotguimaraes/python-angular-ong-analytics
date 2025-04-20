import { Component, OnInit, ViewChild } from '@angular/core'
import { Well } from '../../../models'
import { DashboardDataService } from '../services/dashboard-data.service'
import { Store } from '@ngrx/store'
import { selectWell } from '../../../state/selected-well/selected-well.actions'
import { loadProductionData } from '../../../state/production-data/production-data.actions'
import { BreakpointObserver } from '@angular/cdk/layout'
import { MatSidenav } from '@angular/material/sidenav'
import { setDateRange } from '../../../state/date-range/date-range.actions'

@Component({
	selector: 'app-dashboard',
	standalone: false,
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
	@ViewChild('drawer') drawer!: MatSidenav // Reference the mat-sidenav element
	isMobile = false
	wells: Well[] = []

	constructor(
		private breakpointObserver: BreakpointObserver,
		private store: Store,
		private dataService: DashboardDataService
	) {}

	toggleDrawer(): void {
		this.drawer.toggle()
	}

	ngOnInit(): void {
		this.breakpointObserver.observe(['(max-width: 980px)']).subscribe((result) => {
			this.isMobile = result.matches
		})

		this.dataService.getWells().subscribe((wells: Well[]) => {
			this.wells = wells

			if (wells.length > 0) {
				const well = wells[0]
				this.store.dispatch(selectWell({ well }))
				this.store.dispatch(setDateRange({ start_ms: well.start_ms, end_ms: well.end_ms }))
				this.store.dispatch(
					loadProductionData({
						collection: well.collection,
						start_ms: well.start_ms,
						end_ms: well.end_ms,
					})
				)
			}
		})
	}
}
