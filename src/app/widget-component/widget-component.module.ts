import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { LanguageDropDownComponent } from './global/language-drop-down/language-drop-down.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { SelectAutocompleteCodeComponent } from './select-autocomplete-code/select-autocomplete-code.component';
import { AjouterVisiteComponent } from 'app/visite/ajouter-visite/ajouter-visite.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FicheVisiteComponent } from 'app/visite/fiche-visite/fiche-visite.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AjouterBusinessCaseComponent } from 'app/business-case/ajouter-business-case/ajouter-business-case.component';
import { FicheBusinessCaseComponent } from 'app/business-case/fiche-business-case/fiche-business-case.component';
import { TriListComponent } from './tri-list/tri-list.component';
import { AjouterCodifComponent } from './ajouter-codif/ajouter-codif.component';
import { AidezPdfComponent } from './aidez-pdf/aidez-pdf.component';
// import { ChartsModule } from 'ng2-charts';
import { PdfViewerModule } from 'ng2-pdf-viewer';
@NgModule({
	declarations: [
		LanguageDropDownComponent,
		LoadingSpinnerComponent,
		SelectAutocompleteCodeComponent,
		AjouterVisiteComponent,
		FicheVisiteComponent,
		AjouterBusinessCaseComponent,
		FicheBusinessCaseComponent,
		TriListComponent,
		AjouterCodifComponent,
  		AidezPdfComponent
	],
	imports: [
		MatRadioModule,
		RouterModule,
		CommonModule,
		MatCardModule,
		FlexLayoutModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatExpansionModule,
		MatDialogModule,
		MatFormFieldModule,
		MatSelectModule,
		MatMenuModule,
		MatDividerModule,
		FormsModule,
		ReactiveFormsModule,
		MatSnackBarModule,
		TranslateModule,
		MatChipsModule,
		MatListModule,
		PerfectScrollbarModule,
		MatTableModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		ScrollingModule,
		PdfViewerModule 
	],
	exports: [
		LanguageDropDownComponent,
		LoadingSpinnerComponent,
		SelectAutocompleteCodeComponent,
		AjouterVisiteComponent,
		FicheVisiteComponent,
		TriListComponent,
		AjouterBusinessCaseComponent,
		FicheBusinessCaseComponent,
		AjouterCodifComponent
	],
	entryComponents: [
		SelectAutocompleteCodeComponent,
		AjouterVisiteComponent,
		FicheVisiteComponent,
		TriListComponent,
		AjouterBusinessCaseComponent,
		FicheBusinessCaseComponent,
		AjouterCodifComponent
	]
})

export class WidgetComponentModule { }
