
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./authentication/signin/signin.page').then((m) => m.SigninPage),
    // loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./authentication/signin/signin.page').then((m) => m.SigninPage),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./authentication/signup/signup.page').then((m) => m.SignupPage),
  },
  {
    path: 'intro',
    loadComponent: () => import('./intro/intro.page').then((m) => m.IntroPage),
  },
  {
    path: 'list-friends',
    loadComponent: () =>
      import('./list/list-friends/list-friends.page').then(
        (m) => m.ListFriendsPage
      ),
  },
  {
    path: 'friend-group',
    loadComponent: () => import('./friendgroup/home/friendgroup.page').then( m => m.FriendGroupPage)
  },
  {
    path: 'create-group',
    loadComponent: () => import('./group/create-group/create-group.page').then( m => m.CreateGroupPage)
  },
  {
    path: 'validation',
    loadComponent: () => import('./validation/validation.page').then( m => m.ValidationPage)
  },
  {
    path: 'image-editor',
    loadComponent: () => import('./image-editor/image-editor.page').then( m => m.ImageEditorPage)
  },
  {
    path: 'recap',
    loadComponent: () => import('./friendgroup/recaps/recap.page.component').then(m => m.RecapPageComponent)
  },
  {
    path: 'list-group',
    loadComponent: () => import('./group/list-group/list-group.page').then( m => m.ListGroupPage)
  },



];

