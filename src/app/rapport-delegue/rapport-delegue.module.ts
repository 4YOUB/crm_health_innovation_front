import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RapportDelegueRoutingModule } from './rapport-delegue-routing.module';
import { DelegueComponent } from './delegue/delegue.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DescriptionRowComponent } from './description-row/description-row.component';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    DelegueComponent,
    DescriptionRowComponent
  ],
  imports: [
    CommonModule,
    RapportDelegueRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    MatCardModule,
    MatSelectModule,
    FormsModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatRadioModule,
    MatButtonModule,
  ]
})
export class RapportDelegueModule { }
