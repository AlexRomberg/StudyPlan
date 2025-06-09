import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'plan', loadComponent: () => import('./pages/plan/plan.component').then(m => m.PlanComponent) },
    { path: 'modules', loadComponent: () => import('./pages/modules/modules.component').then(m => m.ModulesComponent) },
    { path: 'modules/:code', loadComponent: () => import('./pages/modules/modules.component').then(m => m.ModulesComponent) },
    { path: '**', redirectTo: 'plan', pathMatch: 'full' },
];
