import { Routes } from '@angular/router';
import { ListeGammesSpecialitesComponent } from './liste-gammes-specialites/liste-gammes-specialites.component';
import { ListeRegionsVillesSecteursComponent } from './liste-regions-villes-secteurs/liste-regions-villes-secteurs.component';
import { RoleGuard } from 'app/service/role-guard.guard';
import { PageAdministrationComponent } from './page-administration/page-administration.component';
import { ListeProduitComponent } from '../parametrage/liste-produit/liste-produit.component';
import { ListeEtablissementComponent } from '../parametrage/liste-etablissement/liste-etablissement.component';
import { ListeFeedbackComponent } from '../parametrage/liste-feedback/liste-feedback.component';

export const AdministrationRoutingModule: Routes = [
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
            component: PageAdministrationComponent,
            data: { roles: ['ADMI'] }
         },
         {
            path: 'regions-villes-secteurs',
            component: ListeRegionsVillesSecteursComponent,
            data: { roles: ['ADMI'] }
         },
         {
            path: 'gammes-specialites',
            component: ListeGammesSpecialitesComponent,
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
