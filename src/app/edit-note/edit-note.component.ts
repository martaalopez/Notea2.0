import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Note } from 'src/app/model/note';
import { UIService } from 'src/app/services/ui.service';
import { NoteService } from '../services/note.service';

@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class EditNoteComponent implements OnInit {
  @Input() data: Note = {
    title: '',
    description: '',
    date: '',
    key: '',
    img:'',
    position: {
      latitude: 0, 
      longitude: 0, 
    }
  };

  todo!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private noteS: NoteService,
    private uiS: UIService,
    private modalCTRL: ModalController
  ) {}

  ngOnInit() {
    this.todo = this.formBuilder.group({
      title: [this.data.title, [Validators.required, Validators.minLength(5)]],
      description: [this.data.description]
    });
  }

  async logForm() {
    if (!this.todo.valid) return;
  
    await this.uiS.showLoading();
    try {
      const titleValue = this.todo.get('title')?.value;
      const descriptionValue = this.todo.get('description')?.value;
  
      if (this.data.key) {
        await this.noteS.updateNote({
          key: this.data.key,
          title: titleValue,
          description: descriptionValue,
          date: this.data.date,
          img: (this.data.img && typeof this.data.img === 'object') ? this.data.img || '' : '',
          position: {
            latitude: this.data.position?.latitude || 0,
            longitude: this.data.position?.longitude || 0,
          }
        });
        this.uiS.showToast("¡Nota actualizada correctamente!");
      } else {
  
        console.error('No se puede agregar una nueva nota aquí. Esta lógica debería estar en otro lugar.');
      }
    } catch (err) {
      console.error(err);
      this.uiS.showToast("Algo ha ido mal ;(", "danger");
    } finally {
      this.uiS.hideLoading();
      this.dismissModalWithUpdatedData();
    }
  }
  

  dismissModalWithUpdatedData() {
    this.modalCTRL.dismiss({
      key: this.data.key,
      title: this.todo.get('title')?.value,
      description: this.todo.get('description')?.value,
    });
  }
}