import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Well } from '../../../../models'
import { Store } from '@ngrx/store'
import { loadProductionData } from '../../../../state/production-data/production-data.actions'
import { selectWell } from '../../../../state/selected-well/selected-well.actions'
import { selectSelectedWell } from '../../../../state/selected-well/selected-well.selectors'
import { setDateRange } from '../../../../state/date-range/date-range.actions'
import { selectDateRange } from '../../../../state/date-range/date-range.selectors'

@Component({
	standalone: false,
	selector: 'app-filter-form',
	templateUrl: './filter-form.component.html',
	styleUrl: './filter-form.component.scss',
})
export class FilterFormComponent {
	@Input() wells: Well[] = []
	@Input() isMobile: boolean = false
	selectedWell$: any
	filterForm!: FormGroup

	constructor(private store: Store, private fb: FormBuilder) {}

	ngOnInit(): void {
		this.selectedWell$ = this.store.select(selectSelectedWell)

		this.filterForm = this.fb.group({
			collection: [null, Validators.required],
			startDate: [null, Validators.required],
			endDate: [null, Validators.required],
		})

		this.selectedWell$.subscribe((well: Well | null) => {
			if (well) {
				this.filterForm.patchValue({
					collection: well.collection,
				})
			}
		})

		this.store.select(selectDateRange).subscribe(({ start_ms, end_ms }) => {
			if (start_ms && end_ms) {
				this.filterForm.patchValue({
					startDate: new Date(start_ms),
					endDate: new Date(end_ms),
				})
			}
		})
	}

	onSubmit() {
		const { collection, startDate, endDate } = this.filterForm.value
		const well = this.wells.find((w) => w.collection === collection)
		if (well) {
			this.store.dispatch(selectWell({ well }))
		} else {
			console.error('No matching well found for the selected collection.')
		}

		const start_ms = new Date(startDate).getTime()
		const end_ms = new Date(endDate).getTime()
		this.store.dispatch(setDateRange({ start_ms, end_ms }))
		this.store.dispatch(loadProductionData({ collection, start_ms, end_ms }))
	}
}
