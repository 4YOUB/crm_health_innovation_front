import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisiteRoutingModule } from './visite-routing.module';
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
import { ListeVisiteComponent } from './liste-visite/liste-visite.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PartenairesModalComponent } from './partenaires-modal/partenaires-modal.component';

@NgModule({
  declarations: [
    ListeVisiteComponent,
    PartenairesModalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(VisiteRoutingModule),
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
    ScrollingModule,
  ]
})
export class VisiteModule { }
