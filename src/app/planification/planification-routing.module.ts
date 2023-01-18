import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { ListePlanificationComponent } from './liste-planification/liste-planification.component';

import { RoleGuard } from 'app/service/role-guard.guard';
import { AjouterPlanificationComponent } from './ajouter-planification/ajouter-planification.component';
import { ListeRapportComponent } from './liste-rapport/liste-rapport.component';
import { FichePlanificationComponent } from './fiche-planification/fiche-planification.component';
// import { ModifierPlanificationComponent } from './modifier-planification/modifier-planification.component';

export const PlanificationRoutingModule: Routes = [
   {
      path: '',
      pathMatch: 'full',
      component: AjouterPlanificationComponent,
   },
   // {
   //    path: '',
   //    canActivateChild: [RoleGuard],
   //    children: [
   //       {
   //          path: 'liste',
   //          component: ListePlanificationComponent,
   //          data: { roles: ['ADMI','DIR','PM','DRG','DSM','KAM','DEL'] }
   //       },
   //       {
   //          path: 'liste/:id_utilisateur',
   //          component: ListePlanificationComponent,
   //          data: { roles: ['ADMI','DIR','PM','DRG','DSM','KAM','DEL'] }
   //       },
   //       {
   //          path: 'ajouter',
   //          component: AjouterPlanificationComponent,
   //          data: { roles: ['DIR','PM','DRG','DSM','KAM','DEL'] }
   //       },
   //       {
   //          path: 'rapports/:id_planification',
   //          component: ListeRapportComponent,
   //          data: { roles: ['DIR','PM','DRG','DSM','KAM','DEL'] }
   //       },
   //       {
   //          path: 'fiche/:id_planification',
   //          component: FichePlanificationComponent,
   //          data: { roles: ['ADMI','DIR','PM','DRG','DSM','KAM','DEL'] }
   //       },
   //       {
   //          path: 'modifier/:id_planification',
   //          component: ModifierPlanificationComponent,
   //          data: { roles: ['DIR','PM','DRG','DSM','KAM','DEL'] }
   //       }
   //    ]
   // }
];