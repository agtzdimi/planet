import { Component, NgZone, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'ngx-leaflet-map',
  styleUrls: ['./map.component.scss'],
  templateUrl: './map.component.html',
})
export class LeafletMapComponent {
  @Input() coordinates: number[];
  @Input() load: boolean = false;
  @Output() coordChange: EventEmitter<number[]>;
  color = '#3887be';
  lngLat: mapboxgl.LngLat;
  constructor() {
    this.lngLat = new mapboxgl.LngLat(7.6825, 45.0678);
    this.coordChange = new EventEmitter<number[]>();
  }
  ngOnInit() {
    Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set('pk.eyJ1IjoiYWd0emRpbWkiLCJhIjoiY2pyaXc2OWN6MDV0cTQ0cXd1NHA0cHI1OSJ9.NQIQGDjleOWNi7bpSu_AGw');
  }
  onDragEnd(marker: mapboxgl.Marker) {
    NgZone.assertInAngularZone();
    this.coordinates = marker.getLngLat().toArray();
    this.coordChange.emit(this.coordinates);
  }

  handleResult(event) {
    let lngLat = new mapboxgl.LngLat(event.result.center[0], event.result.center[1]);
    this.lngLat = lngLat;
    this.coordinates = event.result.center;
    this.coordChange.emit(this.coordinates);
  }

  handleClick(event) {
    if (event.lngLat) {
      let lngLat = new mapboxgl.LngLat(event.lngLat.lng, event.lngLat.lat);
      this.lngLat = lngLat;
      this.coordinates = [event.lngLat.lng, event.lngLat.lat]
      this.coordChange.emit(this.coordinates);
    }
  }
}