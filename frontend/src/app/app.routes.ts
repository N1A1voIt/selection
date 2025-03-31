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

];
