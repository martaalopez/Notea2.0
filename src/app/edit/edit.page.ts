import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Note } from 'src/app/model/note';
import { UIService } from 'src/app/services/ui.service';
import { NoteService } from '../services/note.service';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditPage implements OnInit {

  @Input() data: Note = {
    title: '', description: '',
    date: ''
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
      const titleControl = this.todo.get('title');
      const descriptionControl = this.todo.get('description');
  
      if (titleControl && descriptionControl) {
        const titleValue = titleControl.value;
        const descriptionValue = descriptionControl.value;
  
        if (!this.data) {
          await this.noteS.addNote({
            title: titleValue,
            description: descriptionValue,
            date: new Date().toISOString()
          });
          this.todo.reset("");
          this.uiS.showToast("¡Nota insertada correctamente!");
        } else {
          await this.noteS.updateNote({
            key: this.data.key,
            title: titleValue,
            description: descriptionValue,
            date: new Date().toISOString()
          });
          this.uiS.showToast("¡Nota actualizada correctamente!");
        }
      } else {
        throw new Error("Form controls are null or undefined.");
      }
    } catch (err) {
      console.error(err);
      this.uiS.showToast("Algo ha ido mal ;(", "danger");
    } finally {
      this.uiS.hideLoading();
      this.modalCTRL.dismiss({
        key: this.data?.key,
        title: this.todo.get('title')?.value,
        description: this.todo.get('description')?.value,
      });
    }
  }
  

}
