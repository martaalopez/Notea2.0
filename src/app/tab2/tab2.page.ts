import * as L from 'leaflet';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NoteService } from '../services/note.service';
import { UIService } from '../services/ui.service';
import { Component } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeolocationPosition, Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class Tab2Page {
  public latitude: number | undefined;
  public longitude: number | undefined;
  private map!: L.Map;
  private marker!: L.Marker;
  public form!: FormGroup;
  public imageData: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private noteService: NoteService,
    private uiService: UIService
  ) {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: ['']
    });
  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });
  
    if (image && image.base64String) {
      this.imageData = image.base64String;
      console.log('imageData:', this.imageData); // Verifica el contenido de imageData
      this.previewNote();
      this.getCurrentLocation();
    } else {
      console.error('La imagen capturada está vacía o no tiene base64String.');
    }
  }
  

  async initializeMap(latitude: number, longitude: number) {
    try {
      this.map = L.map('map').setView([latitude, longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.marker = L.marker([latitude, longitude]).addTo(this.map);
      this.map.setView([latitude, longitude], 13);
    } catch (error) {
      console.error(error);
    }
  }

  ngOnInit() {
    this.loadMapWithCurrentLocation();
  }

  async loadMapWithCurrentLocation() {
    try {
      const position = await this.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      await this.initializeMap(latitude, longitude);
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }

  async getCurrentPosition(): Promise<GeolocationPosition> {
    try {
      const position = await Geolocation.getCurrentPosition();
      return position;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getCurrentLocation() {
    try {
      const position = await this.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      this.latitude = latitude;
      this.longitude = longitude;
    } catch (error) {
      console.error(error);
    }
  }
 

  previewNote() {
    if (this.imageData) {
      const imgElement = document.getElementById('previewImage') as HTMLImageElement | null;
      if (imgElement) {
        imgElement.src = 'data:image/jpeg;base64,' + this.imageData;
      } else {
        console.error('Elemento HTML con ID "previewImage" no encontrado');
      }
    } else {
      console.error('La cadena base64 de la imagen está vacía o es inválida.');
    }
    this.getCurrentPosition();
  }
  



async saveNote() {
  if (!this.form.valid || !this.imageData) {
    console.log('Formulario no válido o no hay datos de imagen.');
    return;
  }

  try {
    await this.uiService.showLoading();
    const position = await this.getCurrentPosition();
    const { latitude, longitude } = position.coords;

    const note = {
      title: this.form.get('title')?.value,
      description: this.form.get('description')?.value,
      image: this.imageData,
      date: new Date().toLocaleString(),
      position: {
        latitude: latitude,
        longitude: longitude
      }
    };

    console.log('Nota a guardar:', note); // Verifica los datos de la nota antes de guardarla

    await this.noteService.addNote(note);
    this.form.reset();
    this.imageData = undefined;
    await this.uiService.showToast('Nota introducida correctamente', 'success');
  } catch (error) {
    console.error('Error al insertar la nota:', error);
    await this.uiService.showToast('Error al insertar la nota', 'danger');
  } finally {
    await this.uiService.hideLoading();
  }
}

async borrarFoto() {
  this.imageData = undefined; // Elimina la foto actual
  const imgElement = document.getElementById('previewImage') as HTMLImageElement | null;
  if (imgElement) {
    imgElement.src = ''; // Limpia la imagen previa
  } else {
    console.error('Elemento HTML con ID "previewImage" no encontrado');
  }
}


}