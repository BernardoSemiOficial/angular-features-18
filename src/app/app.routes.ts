import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'users',
    loadComponent: () =>
      import('./modules/users/components/users/users.component').then(
        (c) => c.UsersComponent
      ),
  },
  {
    path: 'users/:userId',
    loadComponent: () =>
      import('./modules/users/components/user/user.component').then(
        (c) => c.UserComponent
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'users',
  },
];
