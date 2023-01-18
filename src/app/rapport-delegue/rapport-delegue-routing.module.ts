import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'app/service/role-guard.guard';
import { DelegueComponent } from './delegue/delegue.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DelegueComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMI', 'DIR', 'PM', 'DRG', 'DSM', 'KAM', 'DEL'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RapportDelegueRoutingModule { }
