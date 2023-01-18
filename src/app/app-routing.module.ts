import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AidezPdfComponent } from './widget-component/aidez-pdf/aidez-pdf.component';

const appRoutes: Routes = [
   {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
   },
   {
      path: '',
      loadChildren: () => import('./session/session.module').then(m => m.SessionModule)
   },
   {
      path: '',
      component: MainComponent,
      canActivate: [AuthGuard],
      runGuardsAndResolvers: 'always',
      children: [
         {
            path: 'dashboard',
            loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
         },
         {
            path: 'partenaires',
            loadChildren: () => import('./partenaire/partenaire.module').then(m => m.PartenaireModule)
         },
         {
            path: 'visites',
            loadChildren: () => import('./visite/visite.module').then(m => m.VisiteModule)
         },
         {
            path: 'planifications',
            loadChildren: () => import('./planification/planification.module').then(m => m.PlanificationModule)
         },
         {
            path: 'investissements',
            loadChildren: () => import('./business-case/business-case.module').then(m => m.BusinessCaseModule)
         },
         {
            path: 'utilisateurs',
            loadChildren: () => import('./utilisateur/utilisateur.module').then(m => m.UtilisateurModule)
         },
         {
            path: 'administration',
            loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
         },
         {
            path: 'parametrage',
            loadChildren: () => import('./parametrage/parametrage.module').then(m => m.ParametrageModule)
         },
         {
            path: 'aide-pdf',
            component: AidezPdfComponent,
         },
         {
            path: 'agenda',
            loadChildren: () => import('./agenda/agenda.module').then(m => m.AgendaModule)
         },
         {
            path: 'rapport-delegue',
            loadChildren: () => import('./rapport-delegue/rapport-delegue.module').then(m => m.RapportDelegueModule)
         }
      ]
   },
   {
      path: '**',
      redirectTo: 'login'
   }
]

@NgModule({
   imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })],
   exports: [RouterModule],
   providers: []
})
export class RoutingModule { }
