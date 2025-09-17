import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/getting-started',
    pathMatch: 'full'
  },
  {
    path: 'getting-started',
    loadChildren: () => import('./features/getting-started/getting-started.module').then(m => m.GettingStartedModule)
  },
  {
    path: 'fundamentals',
    loadChildren: () => import('./features/fundamentals/fundamentals.module').then(m => m.FundamentalsModule)
  },
  {
    path: 'core-concepts',
    loadChildren: () => import('./features/core-concepts/core-concepts.module').then(m => m.CoreConceptsModule)
  },
  {
    path: '**',
    redirectTo: '/getting-started'
  }
];
