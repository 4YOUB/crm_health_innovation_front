import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { ListePartenaireComponent } from './liste-partenaire/liste-partenaire.component';

import { RoleGuard } from 'app/service/role-guard.guard';
import { FichePartenaireComponent } from './fiche-partenaire/fiche-partenaire.component';

export const PartenaireRoutingModule: Routes = [
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
            component: ListePartenaireComponent,
            data: { roles: ['ADMI','DIR','PM','DRG','DSM','KAM','DEL'] }
         },
         {
            path: 'fiche/:id_partenaire',
            component: FichePartenaireComponent,
            data: { roles: ['ADMI','DIR','PM','DRG','DSM','KAM','DEL'] }
         }
      ]
   }
];