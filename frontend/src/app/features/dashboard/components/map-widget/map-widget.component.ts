import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import maplibregl from 'maplibre-gl';
import { Well } from '../../../../models';

@Component({
  standalone: false,
  selector: 'app-map-widget',
  templateUrl: './map-widget.component.html',
  styleUrls: ['./map-widget.component.scss']
})
export class MapWidgetComponent implements AfterViewInit {
  @ViewChild('map') mapElement!: ElementRef;
  @Input() wells: Well[] = [];

  ngAfterViewInit(): void {
    const map = new maplibregl.Map({
      container: this.mapElement.nativeElement,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [55.296249, 25.276987], // [lng, lat]
      zoom: 5
    });

    // Add markers for each well
    this.wells.forEach(well => {
      new maplibregl.Marker()
        .setLngLat([well.longitude, well.latitude])
        .setPopup(new maplibregl.Popup().setText(well.name))
        .addTo(map);
    });
  }
}
