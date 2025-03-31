import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'signin',
    loadComponent: () => import('./authentication/signin/signin.page').then( m => m.SigninPage)
  },
  {
    path: 'kapi-test',
    loadComponent: () => import('./test/animation/kapi').then(m => m.ModelViewerComponent)
  },
];
