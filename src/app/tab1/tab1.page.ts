import { Component } from '@angular/core';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { EditNoteComponent } from '../edit-note/edit-note.component';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../services/note.service';
import { Note } from '../model/note';
import { MapModalComponent } from '../map-modal/map-modal.component';
import { Observable, from } from 'rxjs';
import { tap, mergeMap, map, toArray } from 'rxjs/operators';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule,CommonModule,FormsModule]
})
export class Tab1Page {
  public imageData: string | undefined;
  notes: Note[] = [];
  modalCtrl: ModalController;
  private lastNote:Note|undefined=undefined;
  private notesPerPage:number = 15;
  public isInfiniteScrollAvailable:boolean = true;

  constructor( private alertController:AlertController,public noteS:NoteService,private modalController:ModalController) {
    this.modalCtrl=modalController;
  }
 

  async openMapModal(note: Note) {
    if (note.position && note.position.latitude && note.position.longitude) {
      const modal = await this.modalController.create({
        component: MapModalComponent,
        componentProps: {
          latitude: note.position.latitude, 
          longitude: note.position.longitude 
        }
      });
      await modal.present();
    } else {
      console.error('La nota no tiene coordenadas válidas');
    }
  }
  

 /* ionViewDidEnter() {
    this.noteS.readAll().subscribe((notes: Note[]) => {
      this.notes = notes;
    });
  }*/
  ionViewDidEnter() {
  this.noteS.readAll().subscribe((notes: Note[]) => {
    if (!Array.isArray(notes)) {
      notes = [];
    }
    this.notes = notes; 
  });
}


  chunkArray(array: any[], chunkSize: number) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
  async deleteNoteConfirmation(note: Note) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar esta nota?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteNote(note);
          }
        }
      ]
    });
  
    await alert.present();
  }
  deleteNote($event: Note) {
    if ($event.key) {
      console.log("Eliminando Nota con clave:", $event.key);
      this.noteS.deleteNote($event);
    } else {
      console.error("La nota no tiene una clave válida");
    }
  }
  public async editNote(note: Note) {
    const modal = await this.modalController.create({
      component: EditNoteComponent,
      componentProps: { data: note }
    });
    await modal.present();
  
    const { data, role } = await modal.onWillDismiss();
    if (role !== 'cancel' && data) {
      const index = this.notes.findIndex(e => e.key === data.key);
      if (index > -1) {
        this.notes[index] = data;
      }
    }
  }
  

  doRefresh(event: any) {
    this.isInfiniteScrollAvailable=true;
    this.loadNotes(true,event);
  }
  loadMore(event: any) {
    this.loadNotes(false,event);
  }
  loadNotes(fromFirst: boolean, event?: any) {
    if (fromFirst == false && this.lastNote == undefined) {
      this.isInfiniteScrollAvailable = false;
      event?.target.complete();
      return;
    }

    this.convertPromiseToObservableFromFirebase(
      this.noteS.readNext(this.lastNote, this.notesPerPage)
    ).subscribe((d: Note[]) => {
      event?.target.complete();
      if (fromFirst) {
        this.notes = d; // Reemplazar las notas por las obtenidas si es desde el principio
      } else {
        this.notes = [...this.notes, ...d]; // Concatenar las notas obtenidas
      }

      if (d.length < this.notesPerPage) {
        this.isInfiniteScrollAvailable = false; // No hay más notas disponibles
      } else {
        this.lastNote = d[d.length - 1]; // Actualizar la última nota obtenida
      }
    });
  }
  private convertPromiseToObservableFromFirebase(promise: Promise<any>): Observable<Note[]> {
    return from(promise).pipe(
      tap((d: any) => {
        // Tu lógica aquí
      }),
      mergeMap((d: any) => d.docs),
      map((d: any) => {
        return { key: d.id, ...(d.data() as Note) };
      }),
      toArray()
    );
  }
  previewNote() {
    if (this.imageData) {
      const imgElement = document.getElementById('previewImage') as HTMLImageElement | null;
      if (imgElement) {
        imgElement.src = 'data:image/jpeg;base64,' + this.imageData;
      } else {
        console.error('Elemento HTML con ID "previewImage" no encontrado');
      }
    } 
  
  }

 
}