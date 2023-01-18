import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ListeCodifService } from "app/service/liste-codif-service/liste-codif.service";
import Swal from "sweetalert2";
import * as moment from "moment";
import { FicheVisiteAgendaComponent } from "../fiche-visite-agenda/fiche-visite-agenda.component";
import { AjouterEvenementComponent } from "../ajouter-evenement/ajouter-evenement.component";
import { AjouterVisiteComponent } from "app/visite/ajouter-visite/ajouter-visite.component";
import { AgendaService } from "app/service/agenda-service/agenda.service";
import { AjouterPlanificationComponent } from "../ajouter-planification/ajouter-planification.component";

@Component({
  selector: "ms-actions-dialog",
  templateUrl: "./actions-dialog.component.html",
  styleUrls: ["./actions-dialog.component.scss"],
})
export class ActionsDialogComponent implements OnInit {
  userItem: any = {};
  clickedDate;
  viewType;
  date;
  startDateCalendar;
  endDateCalendar;
  calendar;
  nbrJoursPass;
  heurePasse;
  maxDateVisite = moment(new Date()).format("YYYY-MM-DD");
  minDateVisite = moment(new Date()).format("YYYY-MM-DD");
  dateParam = moment(new Date()).format("YYYY-MM-DD");
  isLimited = false;
  isDateFree = false;
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<ActionsDialogComponent>,
    public dialog: MatDialog,
    private agendaService: AgendaService,
  ) { }

  ngOnInit(): void {
    if (this.viewType == "dayGridMonth") {
      this.date = moment(this.clickedDate).format("LL");
    } else if ((this.viewType = "timeGridWeek")) {
      this.date = moment(this.clickedDate).format("LLL");
    }
    this.minDateVisite = moment(new Date())
      .subtract(this.nbrJoursPass, "days")
      .format("YYYY-MM-DD");
    this.dateParam = moment(this.clickedDate).format("YYYY-MM-DD");
    this.getIsDateFree();
  }

  getIsDateFree() {
    this.isLoading = true;
    this.agendaService.getIsDateFree({
      date: this.dateParam
    }).subscribe(
      (res: any) => {
        this.isDateFree = res.isFree;

        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  isVisiteOK() {
    let dateVisite = moment(this.clickedDate).format("YYYY-MM-DD");
    return (
      new Date(dateVisite).getTime() <=
      new Date(this.maxDateVisite).getTime() &&
      new Date(dateVisite).getTime() >= new Date(this.minDateVisite).getTime()
    );
  }

  isPlanificationOK() {
    let DatePlanification = moment(this.clickedDate).format("YYYY-MM-DD");
    return (
      new Date(DatePlanification).getTime() >=
      new Date(this.maxDateVisite).getTime()
    );
  }

  openPlanification() {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(AjouterPlanificationComponent, {
      width: "600px",
      autoFocus: false,
      maxHeight: "90vh"
    })

    dialogRef.afterClosed().subscribe((result) => {

      this.calendar.getCalendarPersoData(
        this.startDateCalendar,
        this.endDateCalendar,
        this.viewType
      );

    });
    const chosenDate = moment(this.clickedDate)
    dialogRef.componentInstance.clickedDate = {
      date: chosenDate.format('YYYY-MM-DD'),
      time: chosenDate.format('HH:mm')
    }
  }
  openDialogAjouterVisite() {
    const dialogRef = this.dialog.open(AjouterVisiteComponent, {
      width: '900px',
      autoFocus: false,
      maxHeight: '90vh',
      maxWidth: '80vw',
    });
    dialogRef.componentInstance.userItem = this.userItem;
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.calendar.getCalendarPersoData(
          this.startDateCalendar,
          this.endDateCalendar,
          this.viewType
        );
      }
    });
    dialogRef.componentInstance.clickedCalendarDate = this.clickedDate;
  }

  openDialogAjouterEvenement(type = "norm"): void {
    const dialogRef = this.dialog.open(AjouterEvenementComponent, {
      width: "480px",
      autoFocus: false,
      panelClass: [`dialog-custom`],
    });
    dialogRef.componentInstance.userItem = this.userItem;
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.calendar.getCalendarPersoData(
          this.startDateCalendar,
          this.endDateCalendar,
          this.viewType
        );
      }
    });
    dialogRef.componentInstance.clickedDate = this.clickedDate;
    dialogRef.componentInstance.id_utilisateur =
      this.calendar.typeAgenda == "Un délégué de mon équipe"
        ? this.calendar.form.controls.id_utilisateur.value
        : null;
    dialogRef.componentInstance.typeEvenement = type;
  }
}
