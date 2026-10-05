import { Routes } from '@angular/router';
//Las rutas del tutorial o estan mal, o mi organizacion esta mal, pero el ../ no funciona solo el ./ .
export const routes: Routes = [
  { path: '', redirectTo: '/games', pathMatch: 'full' },
  {
    path: 'categories',
    loadComponent: () =>
      import('./category/category-list/category-list.page').then((m) => m.CategoryList),
  },
  {
    path: 'authors',
    loadComponent: () => import('./author/author-list/author-list.page').then((m) => m.AuthorList),
  },
  {
    path: 'games',
    loadComponent: () => import('./game/game-list/game-list.page').then((m) => m.GameList),
  },
];
