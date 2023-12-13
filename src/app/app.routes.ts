import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },  {
    path: 'edit',
    loadComponent: () => import('./edit/edit.page').then( m => m.EditPage)
  },

];
