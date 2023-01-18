import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { ListeBusinessCaseComponent } from './liste-business-case/liste-business-case.component';

import { RoleGuard } from 'app/service/role-guard.guard';

export const BusinessCaseRoutingModule: Routes = [
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
            component: ListeBusinessCaseComponent,
            data: { roles: ['ADMI','DIR','PM','DRG','DSM','KAM','ACH'] }
         },
         {
            path: 'liste/:id_utilisateur',
            component: ListeBusinessCaseComponent,
            data: { roles: ['ADMI','DIR','PM','DRG','DSM','KAM','ACH'] }
         }
      ]
   }
];