import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import *as L from 'leaflet';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class Tab3Page {
  map!: L.Map;

  constructor() {}
  ngOnInit(){
  }
  ionViewDidEnter(){
    this.map=L.map('mapId').setView([37.57903,-4.6553779],13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(this.map);
const markPoint=L.marker([37.57903,-4.6553779]);
this.map.addLayer(markPoint);

  }
  
}
