import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // loadComponent: () => import('./friendgroup/home/friendgroup.page').then( m => m.FriendGroupPage)
    loadComponent: () => import('./authentication/signin/signin.page').then( m => m.SigninPage)
    // loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'signin',
    loadComponent: () => import('./authentication/signin/signin.page').then( m => m.SigninPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./authentication/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'friend-group',
    loadComponent: () => import('./friendgroup/home/friendgroup.page').then( m => m.FriendGroupPage)
  },

];
