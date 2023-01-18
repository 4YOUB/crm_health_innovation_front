import { Routes } from '@angular/router';
import { ListeProduitComponent } from './liste-produit/liste-produit.component';
import { RoleGuard } from 'app/service/role-guard.guard';
import { ListeEtablissementComponent } from './liste-etablissement/liste-etablissement.component';
import { ListeFeedbackComponent } from './liste-feedback/liste-feedback.component';
import { PageParametrageComponent } from './page-parametrage/page-parametrage.component';

export const ParametrageRoutes: Routes = [
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
            component: PageParametrageComponent,
            data: { roles: ['ADMI'] }
         },
         {
            path: 'etablissement',
            component: ListeEtablissementComponent,
            data: { roles: ['ADMI'] }
         },
         {
            path: 'feedback',
            component: ListeFeedbackComponent,
            data: { roles: ['ADMI'] }
         },
         {
            path: 'produits',
            component: ListeProduitComponent,
            data: { roles: ['ADMI'] }
         }
      ]
   }
];
