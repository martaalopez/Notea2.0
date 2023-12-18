import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'edit',
    loadComponent: () => import('./edit-note/edit-note.component').then( m => m.EditNoteComponent)
  },

  {
    path: 'map-modal',
    loadComponent: () => import('./map-modal/map-modal.component').then( m => m.MapModalComponent)
  },

];

