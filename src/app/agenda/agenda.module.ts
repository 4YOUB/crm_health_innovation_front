import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDividerModule } from "@angular/material/divider";
import { MatTableModule } from "@angular/material/table";
import { MatChipsModule } from "@angular/material/chips";
import { MatSelectModule } from "@angular/material/select";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatSortModule } from "@angular/material/sort";
import { MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { TranslateModule } from "@ngx-translate/core";
import { MatListModule } from "@angular/material/list";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatInputModule } from "@angular/material/input";
import { AgendaRoutingModule } from "./agenda-routing.module";
import { RouterModule } from "@angular/router";
import { FullCalendarModule } from "@fullcalendar/angular"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import { AngularResizedEventModule } from "angular-resize-event";
import { FicheVisiteAgendaComponent } from "./fiche-visite-agenda/fiche-visite-agenda.component";
import { AgendaComponent } from "./agenda/agenda.component";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { MoreInfoDialogComponent } from "./more-info-dialog/more-info-dialog.component";
import { WidgetComponentModule } from "app/widget-component/widget-component.module";
import { AjouterEvenementComponent } from "./ajouter-evenement/ajouter-evenement.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import interactionPlugin from "@fullcalendar/interaction";
import { MatRadioModule } from "@angular/material/radio";
import { ActionsDialogComponent } from './actions-dialog/actions-dialog.component';
import { FicheEvenementAgendaComponent } from "./fiche-evenement-agenda/fiche-evenement-agenda.component";
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MonAgendaComponent } from "./mon-agenda/mon-agenda.component";
import { AgendaEquipeComponent } from "./agenda-equipe/agenda-equipe.component";
import { AgendaDelegueComponent } from "./agenda-delegue/agenda-delegue.component";
import { AgendaRapportDelegueComponent } from "./agenda-rapport-delegue/agenda-rapport-delegue.component";
import { AjouterPlanificationComponent } from './ajouter-planification/ajouter-planification.component';
import { ListeCodifService } from "app/service/liste-codif-service/liste-codif.service";

FullCalendarModule.registerPlugins([
  // register FullCalendar plugins
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin,
]);

@NgModule({
  declarations: [
    AgendaComponent,
    MoreInfoDialogComponent,
    AjouterEvenementComponent,
    ActionsDialogComponent,
    FicheEvenementAgendaComponent,
    MonAgendaComponent,
    AgendaEquipeComponent,
    AgendaDelegueComponent,
    AgendaRapportDelegueComponent,
    AjouterPlanificationComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AgendaRoutingModule),
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatDividerModule,
    MatTableModule,
    MatChipsModule,
    MatSelectModule,
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
    ScrollingModule,
    FullCalendarModule,
    AngularResizedEventModule,
    NgbPopoverModule,
    WidgetComponentModule,
    MatDatepickerModule,
    MatRadioModule,
    MatBadgeModule,
    MatCheckboxModule,
  ],
})
export class AgendaModule { }
