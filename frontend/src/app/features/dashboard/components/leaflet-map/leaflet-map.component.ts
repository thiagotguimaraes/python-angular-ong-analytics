import { Component, Input, AfterViewInit, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core'
import * as L from 'leaflet'
import { Store } from '@ngrx/store'
import { selectWell } from '../../../../state/selected-well/selected-well.actions'
import { loadProductionData } from '../../../../state/production-data/production-data.actions'
import { Well } from '../../../../models'
import { selectSelectedWell } from '../../../../state/selected-well/selected-well.selectors'
import { setDateRange } from '../../../../state/date-range/date-range.actions'

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
	iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
	iconUrl: 'assets/leaflet/marker-icon.png',
	shadowUrl: 'assets/leaflet/marker-shadow.png',
})

@Component({
	standalone: false,
	selector: 'app-leaflet-map',
	templateUrl: './leaflet-map.component.html',
	styleUrls: ['./leaflet-map.component.scss'],
})
export class LeafletMapComponent implements AfterViewInit, OnChanges {
	constructor(private store: Store) {}

	@ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef
	@Input() wells: Well[] = []
	map!: L.Map
	selectedWell$: any
	selectedWell: Well | null = null

	defaultIcon = L.icon({
		iconUrl: 'assets/leaflet/marker-icon.png',
		shadowUrl: 'assets/leaflet/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
	})

	selectedIcon = L.icon({
		iconUrl: 'assets/leaflet/marker-icon-selected.png', // Use a different icon for the selected well
		shadowUrl: 'assets/leaflet/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
	})

	private update() {
		this.map.eachLayer((layer) => {
			if (layer instanceof L.Marker) {
				this.map.removeLayer(layer)
			}
		})

		// Add markers with appropriate icons
		this.wells.forEach((well) => {
			const isSelected = this.selectedWell && well.collection === this.selectedWell.collection
			L.marker([well.latitude, well.longitude], {
				icon: isSelected ? this.selectedIcon : this.defaultIcon,
			})
				.addTo(this.map)
				.bindPopup(`<b>${well.name}</b>`)
				.on('click', () => {
					console.log('Clicked well:', well.name)
					this.store.dispatch(selectWell({ well }))
					this.store.dispatch(setDateRange({ start_ms: well.start_ms, end_ms: well.end_ms }))
					this.store.dispatch(
						loadProductionData({
							collection: well.collection,
							start_ms: well.start_ms,
							end_ms: well.end_ms,
						})
					)
				})
		})

		if (this.wells.length > 0) {
			// Adjust map bounds
			const bounds = L.latLngBounds(this.wells.map((w) => [w.latitude, w.longitude]))
			this.map.fitBounds(bounds, { padding: [20, 20] })
		}
	}

	ngAfterViewInit(): void {
		this.map = L.map(this.mapContainer.nativeElement).setView([0, 0], 6)

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; OpenStreetMap contributors',
		}).addTo(this.map)

		this.selectedWell$ = this.store.select(selectSelectedWell)

		this.selectedWell$.subscribe((selectedWell: Well | null) => {
			this.selectedWell = selectedWell
			this.update()
		})

		// Trigger map resize
		setTimeout(() => this.map.invalidateSize(), 100)
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['wells'] && !changes['wells'].firstChange) {
			this.update() // Refresh the map when wells input changes
		}
	}
}
