import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ParametrageRoutes } from './parametrage.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetComponentModule } from '../widget-component/widget-component.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMaskModule } from 'ngx-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageParametrageComponent } from './page-parametrage/page-parametrage.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AjouterProduitComponent } from './ajouter-produit/ajouter-produit.component';
import { GammeProduitComponent } from './gamme-produit/gamme-produit.component';

@NgModule({
	declarations: [
		PageParametrageComponent,
		AjouterProduitComponent,
		GammeProduitComponent,
	],
	imports: [
		CommonModule,
		RouterModule.forChild(ParametrageRoutes),
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
		TranslateModule,
		MatListModule,
		NgbModule,
		PerfectScrollbarModule,
		MatProgressSpinnerModule,
		MatProgressBarModule,
		FlexLayoutModule,
		NgxMaskModule.forRoot({
			showMaskTyped: false,
			// clearIfNotMatch : true
		}),
		MatTabsModule,
		MatRadioModule,
		MatCheckboxModule,
		ScrollingModule
	]
})
export class ParametrageModule { }
