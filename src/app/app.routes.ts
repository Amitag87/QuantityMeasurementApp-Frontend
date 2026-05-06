import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/converter/converter.component').then(m => m.ConverterComponent)
  },
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'oauth2/callback',
    loadComponent: () => import('./components/auth/oauth-callback.component').then(m => m.OAuthCallbackComponent)
  },
  {
    path: 'history',
    loadComponent: () => import('./components/history/history.component').then(m => m.HistoryComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
