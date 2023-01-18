import { Routes } from '@angular/router';
import { SaasComponent } from './saas/saas.component';
import { CrmComponent } from './crm/crm.component';
import { RoleGuard } from 'app/service/role-guard.guard';

export const DashboardRoutes: Routes = [
   {
      path: '',
      redirectTo: 'crm',
      pathMatch: 'full'
   },
   {
      path: '',
      canActivateChild: [RoleGuard],
      children: [
         {
            path: 'saas',
            component: SaasComponent,
            data: { roles: ['DIR','PM','DRG','DSM','KAM','DEL','ACH'] }
         },
         {
            path: "crm",
            component : CrmComponent,
            data: { roles: ['ADMI','DIR','PM','DRG','DSM','KAM','DEL','ACH'] }
         }
      ]
   }
];
