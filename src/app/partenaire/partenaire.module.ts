import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartenaireRoutingModule } from './partenaire-routing.module';
import { ListePartenaireComponent } from './liste-partenaire/liste-partenaire.component';
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
import { AjouterPartenaireComponent } from './ajouter-partenaire/ajouter-partenaire.component';
import { NgxMaskModule } from 'ngx-mask';
import { FichePartenaireComponent } from './fiche-partenaire/fiche-partenaire.component'
import { MatTabsModule } from '@angular/material/tabs';
import { ListeTabVisiteComponent } from './tab-visite/liste-tab-visite/liste-tab-visite.component';
import { TabModalProduitsComponent } from './tab-visite/tab-modal-produits/tab-modal-produits.component';
import { ListeTabNoteComponent } from './tab-note/liste-tab-note/liste-tab-note.component';
import { TabModalNoteComponent } from './tab-note/tab-modal-note/tab-modal-note.component';
import { ListeTabBusinessCaseComponent } from './tab-business-case/liste-tab-business-case/liste-tab-business-case.component';
import { TabModalCommentaireComponent } from './tab-business-case/tab-modal-commentaire/tab-modal-commentaire.component';
import { ListeTabDocumentComponent } from './tab-document/liste-tab-document/liste-tab-document.component';
import { TabModalAjoutNoteComponent } from './tab-note/tab-modal-ajout-note/tab-modal-ajout-note.component';
import { TabAjouterDocumentComponent } from './tab-document/tab-ajouter-document/tab-ajouter-document.component';

@NgModule({
  declarations: [
    ListePartenaireComponent,
    AjouterPartenaireComponent,
    FichePartenaireComponent,
    ListeTabVisiteComponent,
    TabModalProduitsComponent,
    ListeTabNoteComponent,
    TabModalNoteComponent,
    ListeTabBusinessCaseComponent,
    TabModalCommentaireComponent,
    ListeTabDocumentComponent,
    TabModalAjoutNoteComponent,
    TabAjouterDocumentComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PartenaireRoutingModule),
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
		NgxMaskModule.forRoot({
		  showMaskTyped : false,
		  // clearIfNotMatch : true
		}),
    MatTabsModule
  ]
})
export class PartenaireModule { }
