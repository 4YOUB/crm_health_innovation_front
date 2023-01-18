import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanificationRoutingModule } from './planification-routing.module';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import { WidgetComponentModule } from 'app/widget-component/widget-component.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { TranslateModule } from '@ngx-translate/core';
import { MatListModule } from '@angular/material/list';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ListePlanificationComponent } from './liste-planification/liste-planification.component';
import { AjouterPlanificationComponent } from './ajouter-planification/ajouter-planification.component';
import { ListeRapportComponent } from './liste-rapport/liste-rapport.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AjouterRapportComponent } from './ajouter-rapport/ajouter-rapport.component';
import { FichePlanificationComponent } from './fiche-planification/fiche-planification.component';
// import { ModifierPlanificationComponent } from './modifier-planification/modifier-planification.component';
import { AngularResizedEventModule } from "angular-resize-event";
import { InfiniteScrollModule } from "ngx-infinite-scroll";


@NgModule({
  declarations: [
    ListePlanificationComponent,
    AjouterPlanificationComponent,
    ListeRapportComponent,
    AjouterRapportComponent,
    FichePlanificationComponent,
    // ModifierPlanificationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PlanificationRoutingModule),
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatDividerModule,
    MatTableModule,
    MatChipsModule,
    MatSelectModule,
    WidgetComponentModule,
    MatSortModule,
    MatExpansionModule,
    MatDialogModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    SlickCarouselModule,
    TranslateModule,
    MatListModule,
    NgbModule,
    PerfectScrollbarModule, 
    MatProgressSpinnerModule,
    MatProgressBarModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatRadioModule,
    AngularResizedEventModule,
    InfiniteScrollModule,
  ]
})
export class PlanificationModule { }
