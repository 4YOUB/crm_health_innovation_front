import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import { RoleGuard } from 'app/service/role-guard.guard';
import { ListeDelegueComponent } from './liste-delegue/liste-delegue.component';
import { ListeUtilisateurComponent } from './liste-utilisateur/liste-utilisateur.component';

export const UtilisateurRoutingModule: Routes = [
   {
      path: '',
      redirectTo: 'liste',
      pathMatch: 'full'
   },
   {
      path: '',
      canActivateChild: [RoleGuard],
      children: [
         {
            path: 'liste',
            component: ListeUtilisateurComponent,
            data: { roles: ['ADMI'] }
         },
         {
            path: 'delegues',
            component: ListeDelegueComponent,
            data: { roles: ['DIR', 'DRG', 'PM', 'DSM', 'KAM'] }
         }
      ]
   }
];