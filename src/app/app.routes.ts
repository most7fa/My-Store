import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'product-details',
    loadComponent: () => import('./pages/product-details/product-details.page').then( m => m.ProductDetailsPage)
  },
];
