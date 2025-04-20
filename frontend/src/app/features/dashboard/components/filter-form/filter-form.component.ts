import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Well } from '../../../../models'
import { Store } from '@ngrx/store'
import { loadProductionData } from '../../../../state/production-data/production-data.actions'
import { selectWell } from '../../../../state/selected-well/selected-well.actions'
import { selectSelectedWell } from '../../../../state/selected-well/selected-well.selectors'

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
			collection: [null],
			startDate: [null],
			endDate: [null],
		})

		this.selectedWell$.subscribe((well: Well | null) => {
			if (well) {
				this.filterForm.patchValue({
					collection: well.collection,
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
		this.store.dispatch(loadProductionData({ collection, start_ms, end_ms }))
	}
}
