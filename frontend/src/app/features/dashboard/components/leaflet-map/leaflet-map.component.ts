import {
  Component,
  Input,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { Store } from '@ngrx/store';
import { selectWell } from '../../../../state/selected-well/selected-well.actions';
import { loadProductionData } from '../../../../state/production-data/production-data.actions';
import { Well } from '../../../../models';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
});

@Component({
  standalone: false,
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss'],
})
export class LeafletMapComponent implements AfterViewInit {
  constructor(private store: Store) {}

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  @Input() wells: Well[] = [];

  map!: L.Map;

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([0, 0], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.wells.forEach((well) => {
      L.marker([well.latitude, well.longitude])
        .addTo(this.map)
        .bindPopup(`<b>${well.name}</b>`)
        .on('click', () => {
          console.log('Clicked well:', well.name);
          this.store.dispatch(selectWell({ well }));
          this.store.dispatch(
            loadProductionData({
              collection: well.collection,
              start_ms: null,
              end_ms: null,
            })
          );
        });
    });

    const bounds = L.latLngBounds(
      this.wells.map((w) => [w.latitude, w.longitude])
    );
    this.map.fitBounds(bounds, { padding: [20, 20] });

    // Important: Leaflet only fires 'load' after tiles fully render
    // So we need to explicitly trigger it by setting the view
    setTimeout(() => this.map.invalidateSize(), 100);
  }
}
