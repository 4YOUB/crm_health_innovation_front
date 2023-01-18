import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ToastrModule } from 'ngx-toastr';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';

import { SessionRoutes } from './session.routing';
import { WidgetComponentModule } from 'app/widget-component/widget-component.module';

@NgModule({
	declarations: [
		LoginComponent,
	],
	imports: [
		CommonModule,
		MatInputModule,
		MatFormFieldModule,
		FlexLayoutModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatToolbarModule,
		MatCheckboxModule,
		MatDividerModule,
		FormsModule,
		TranslateModule,
		ReactiveFormsModule,
		RouterModule.forChild(SessionRoutes),
		ToastrModule.forRoot(),
		SlickCarouselModule,
		WidgetComponentModule
	]
})
export class SessionModule { }
