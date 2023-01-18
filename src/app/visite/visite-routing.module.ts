import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { ListeVisiteComponent } from './liste-visite/liste-visite.component';

import { RoleGuard } from 'app/service/role-guard.guard';

export const VisiteRoutingModule: Routes = [
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
            component: ListeVisiteComponent,
            data: { roles: ['ADMI','DIR','PM','DRG','DSM','KAM','DEL'] }
         },
         {
            path: 'liste/:id_utilisateur',
            component: ListeVisiteComponent,
            data: { roles: ['ADMI','DIR','PM','DRG','DSM','KAM','DEL'] }
         }
      ]
   }
];