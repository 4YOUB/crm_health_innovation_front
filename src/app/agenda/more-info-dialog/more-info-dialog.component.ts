import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { FicheVisiteAgendaComponent } from '../fiche-visite-agenda/fiche-visite-agenda.component';
import { FicheEvenementAgendaComponent } from '../fiche-evenement-agenda/fiche-evenement-agenda.component';

@Component({
  selector: 'ms-more-info-dialog',
  templateUrl: './more-info-dialog.component.html',
  styleUrls: ['./more-info-dialog.component.scss']
})
export class MoreInfoDialogComponent implements OnInit {

  userItem: any = {};
  elements
  elementsType
  constructor(
    public dialogRef: MatDialogRef<MoreInfoDialogComponent>,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    if (this.elementsType == 'visites') {
      this.elements.sort(function (a, b) {
        return a.hour.localeCompare(b.hour);
      });
    }
  }

  openDialogFicheVisiteAgenda(id_visite): void {
    const dialogRef = this.dialog.open(FicheVisiteAgendaComponent, {
      width: "900px",
      autoFocus: false,
      maxHeight: "90vh",
    });
    dialogRef.componentInstance.id_visite = id_visite;
  }

  openDialogMoreInfo(elements, elementsType): void {
    const dialogRef = this.dialog.open(MoreInfoDialogComponent, {
      width: "500px",
      autoFocus: false,
      maxHeight: "90vh",
      panelClass: [`dialog-custom`],
    });
    dialogRef.componentInstance.elements = elements;
    dialogRef.componentInstance.elementsType = elementsType;
  }

  openDialogFicheEvenementAgenda(id_evenement, clickedDate): void {
    const dialogRef = this.dialog.open(FicheEvenementAgendaComponent, {
      width: "500px",
      autoFocus: false,
      maxHeight: "90vh",
      panelClass: [`dialog-custom`],
    });
    dialogRef.componentInstance.id_evenement = id_evenement;
    dialogRef.componentInstance.isCanEdit = false;
    dialogRef.componentInstance.clickedDate = clickedDate;
  }

}
