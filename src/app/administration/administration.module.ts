import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdministrationRoutingModule } from './administration-routing.module';
import { WidgetComponentModule } from 'app/widget-component/widget-component.module';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
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
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatInputModule } from '@angular/material/input';
import { PageAdministrationComponent } from './page-administration/page-administration.component';
import { ListeRegionsVillesSecteursComponent } from './liste-regions-villes-secteurs/liste-regions-villes-secteurs.component';
import { ListeGammesSpecialitesComponent } from './liste-gammes-specialites/liste-gammes-specialites.component';

@NgModule({
  declarations: [
    ListeGammesSpecialitesComponent,
    ListeRegionsVillesSecteursComponent,
    PageAdministrationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AdministrationRoutingModule),
    WidgetComponentModule,
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
    ScrollingModule,
  ]
})
export class AdministrationModule { }
