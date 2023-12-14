import { Component } from '@angular/core';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { EditPage } from '../edit/edit.page';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../services/note.service';
import { Note } from '../model/note';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule,CommonModule,FormsModule]
})
export class Tab1Page {
  notes: Note[] = [];

  modalCtrl: ModalController;

  constructor( private alertController:AlertController,public noteS:NoteService,private modalController:ModalController) {
    this.modalCtrl=modalController;
  }

  ionViewDidEnter() {
    this.noteS.readAll().subscribe((notes: Note[]) => {
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
    const modal = await this.modalCtrl.create({
      component: EditPage,
      componentProps: { data: note }
    });
    await modal.present();
  
    const { data, role } = await modal.onWillDismiss();
    if (!role) {
      if (data) {
        try {
          await this.noteS.updateNote(data);
          // Aquí, vuelve a cargar o actualiza la lista de notas, ya que has editado una nota
          this.noteS.readAll().subscribe((notes: Note[]) => {
            // Actualiza tu lista de notas con los datos actualizados
          });
          console.log("¡Nota actualizada correctamente!");
        } catch (error) {
          console.error("Error al actualizar la nota:", error);
        }
      }
    }
  }
}
