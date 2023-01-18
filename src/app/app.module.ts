import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Ng5BreadcrumbModule, BreadcrumbService } from 'ng5-breadcrumb';
import { TourMatMenuModule } from 'ngx-tour-md-menu';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RoutingModule } from "./app-routing.module";
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { AuthService } from './service/auth-service/auth.service';
import { PageTitleService } from './core/page-title/page-title.service';
import { GeneAppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { MenuToggleModule } from './core/menu/menu-toggle.module';
import { MenuItems } from './core/menu/menu-items/menu-items';
import { AuthGuard } from './core/guards/auth.guard';
import { WidgetComponentModule } from './widget-component/widget-component.module';
import { SideBarComponent } from './Shared/side-bar/side-bar.component';
import { FooterComponent } from './Shared/footer/footer.component';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptorService } from './service/auth-interceptor.service';
import { ExpireSessionService } from './service/expire-session/expire-session.service';
import { RoleGuard } from './service/role-guard.guard';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChartsModule } from 'ng2-charts';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { FicheVisiteAgendaComponent } from './agenda/fiche-visite-agenda/fiche-visite-agenda.component';
import { ListeEtablissementComponent } from './parametrage/liste-etablissement/liste-etablissement.component';
import { ListeFeedbackComponent } from './parametrage/liste-feedback/liste-feedback.component';
import { ListeProduitComponent } from './parametrage/liste-produit/liste-produit.component';
import { MatPaginatorModule } from '@angular/material/paginator';


registerLocaleData(localeFr);

export const firebaseConfig = {
	apiKey: "AIzaSyCE0po6Q8jGuBEds-A903KEU4U6Cerojzo",
	authDomain: "gene-eaeef.firebaseapp.com",
	databaseURL: "https://gene-eaeef.firebaseio.com",
	projectId: "gene-eaeef",
	storageBucket: "gene-eaeef.appspot.com",
	messagingSenderId: "81833823583",
	appId: "1:81833823583:web:581d7ddd8cfa93a4"
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	suppressScrollX: true
};

@NgModule({
	imports: [
		CommonModule,
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		RoutingModule,
		FlexLayoutModule,
		Ng5BreadcrumbModule.forRoot(),
		TourMatMenuModule.forRoot(),
		PerfectScrollbarModule,
		MenuToggleModule,
		HttpClientModule,
		MatSlideToggleModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		AngularFireModule.initializeApp(firebaseConfig),
		AngularFireAuthModule,
		MatButtonModule,
		MatCardModule,
		MatMenuModule,
		MatToolbarModule,
		MatIconModule,
		MatBadgeModule,
		MatInputModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatProgressSpinnerModule,
		MatTableModule,
		MatExpansionModule,
		MatSelectModule,
		MatSnackBarModule,
		MatTooltipModule,
		MatChipsModule,
		MatListModule,
		MatSidenavModule,
		MatTabsModule,
		MatProgressBarModule,
		MatCheckboxModule,
		MatSliderModule,
		MatRadioModule,
		MatDialogModule,
		MatGridListModule,
		MatTableModule,
		MatPaginatorModule,
		ToastrModule.forRoot(),
		WidgetComponentModule,
		LoadingBarRouterModule,
		ScrollingModule,
		ChartsModule
	],
	declarations: [
		GeneAppComponent,
		MainComponent,
		SideBarComponent, FooterComponent,
		FicheVisiteAgendaComponent,
		ListeEtablissementComponent,
		ListeFeedbackComponent,
		ListeProduitComponent
	],
	bootstrap: [GeneAppComponent],
	providers: [
		MenuItems,
		BreadcrumbService,
		PageTitleService,
		AuthService,
		{
			provide: PERFECT_SCROLLBAR_CONFIG,
			useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
		},
		AuthGuard,
		RoleGuard,
		CookieService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptorService,
			multi: true,
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ExpireSessionService,
			multi: true
		},
		{
			provide: MAT_DATE_LOCALE,
			useValue: 'fr'
		},
		{
			provide: LOCALE_ID,
			useValue: 'fr'
		}
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GeneAppModule { }
