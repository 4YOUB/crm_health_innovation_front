import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'app/service/role-guard.guard';
import { AgendaComponent } from './agenda/agenda.component';
import { MonAgendaComponent } from './mon-agenda/mon-agenda.component';
import { AgendaEquipeComponent } from './agenda-equipe/agenda-equipe.component';
import { AgendaDelegueComponent } from "./agenda-delegue/agenda-delegue.component";
import { AgendaRapportDelegueComponent } from "./agenda-rapport-delegue/agenda-rapport-delegue.component";

export const AgendaRoutingModule: Routes = [
   {
      path: '',
      pathMatch: 'full',
      redirectTo: 'mon-agenda',
      // component: AgendaComponent,
   },
   {
      path: '',
      canActivateChild: [RoleGuard],
      children: [
         {
            path: 'mon-agenda',
            component: MonAgendaComponent,
            data: { roles: ['ADMI','DIR','PM','DRG','DSM','KAM','DEL'] }
         },
         {
            path: 'agenda-rapport-equipe',
            component: AgendaEquipeComponent,
            data: { roles: ['ADMI','DIR','PM','DRG','DSM','KAM'] }
         },
         {
            path: 'agenda-delegue',
            component: AgendaDelegueComponent,
            data: { roles: ['ADMI','DIR','PM','DRG','DSM','KAM'] }
         },
         {
            path: 'agenda-rapport-delegue',
            component: AgendaRapportDelegueComponent,
            data: { roles: ['ADMI','DIR','PM','DRG','DSM','KAM'] }
         },
      ]
   }
];