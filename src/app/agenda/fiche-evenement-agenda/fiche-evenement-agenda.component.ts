import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ListeCodifService } from "app/service/liste-codif-service/liste-codif.service";
import Swal from "sweetalert2";
import * as moment from "moment";
import { ParamsAppService } from "../../service/params-app-service/params-app.service";
import { AgendaService } from "app/service/agenda-service/agenda.service";
import { AjouterEvenementComponent } from "../ajouter-evenement/ajouter-evenement.component";

@Component({
  selector: "ms-fiche-evenement-agenda",
  templateUrl: "./fiche-evenement-agenda.component.html",
  styleUrls: ["./fiche-evenement-agenda.component.scss"],
})
export class FicheEvenementAgendaComponent implements OnInit {
  userItem: any = {};
  listStatusColors = [];
  id_evenement;
  itemEvenement: any = {};
  isLoading = false;
  calendar;
  clickedDate
  isCanEdit = true;
  listTypesEvenementPro = [
    "FORM",
    "REIN",
    "SMNR",
    "CNGR"
  ];

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<FicheEvenementAgendaComponent>,
    private paramsAppService: ParamsAppService,
    private agendaService: AgendaService
  ) { }

  ngOnInit(): void {
    this.get_app_params();
    this.getFicheEvenement();
  }

  isPro(code) {
    return this.listTypesEvenementPro.includes(code);
  }

  get_app_params() {
    this.paramsAppService.get().then((params: any) => {
      this.listStatusColors = params["CSTE"];
    });
  }

  getFicheEvenement() {
    this.isLoading = true;

    this.agendaService.getFicheEvenementAgenda(this.id_evenement).subscribe(
      (res: any) => {
        this.itemEvenement = {
          ...res.evenement,
          date_deb_evenement: ["FORM", "EABS", ...this.listTypesEvenementPro].includes(
            res.evenement.code_evenement
          )
            ? moment(res.evenement.date_deb_evenement).format(
              "DD/MM/YYYY HH:mm"
            )
            : moment(res.evenement.date_deb_evenement).format("DD/MM/YYYY"),
          date_fin_evenement: ["FORM", "EABS", ...this.listTypesEvenementPro].includes(
            res.evenement.code_evenement
          )
            ? moment(res.evenement.date_fin_evenement).format(
              "DD/MM/YYYY HH:mm"
            )
            : moment(res.evenement.date_fin_evenement).format("DD/MM/YYYY"),
        };
        this.isLoading = false;
      },
      (err) => {
        this.showMessageError();
      }
    );
  }

  deleteEvenement(): void {
    Swal.fire({
      text: "Êtes-vous sûr de vouloir supprimer cet évènement?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--princ-health-color)",
      cancelButtonColor: "#b4b2b2",
      confirmButtonText: "Supprimer",
      cancelButtonText: "Annuler",
      heightAuto: false,
    }).then((result) => {
      if (result.value) {
        this.operationEnCours();
        this.agendaService.deleteEvenementAgenda(this.id_evenement).subscribe(
          (res) => {
            this.calendar.getCalendarPersoData(
              this.calendar.startDateCalendar,
              this.calendar.endDateCalendar,
              this.calendar.calendarComponent.getApi().view.type
            );
            this.showMessageSuccess("supprimé");
          },
          (err) => {
            this.showMessageError();
          }
        );
      }
    });
    this.dialogRef.close();
  }

  operationEnCours() {
    Swal.fire({
      title: "Opération est en cours!",
      heightAuto: false,
      didOpen: () => {
        Swal.showLoading(null);
      },
    });
  }

  showMessageSuccess(msg) {
    Swal.fire({
      icon: "success",
      text: `Cet évènement a été ` + msg + ` avec succès`,
      showConfirmButton: true,
      heightAuto: false,
      timer: 3500,
    });
  }
  showMessageError() {
    Swal.fire({
      icon: "error",
      text: `une erreur s'est produite. veuillez réessayer ultérieurement.`,
      showConfirmButton: false,
      heightAuto: false,
      timer: 2500,
    });
  }

  openDialogAjouterEvenement(): void {
    const dialogRef = this.dialog.open(AjouterEvenementComponent, {
      width: "480px",
      autoFocus: false,
      panelClass: [`dialog-custom`],
    });
    dialogRef.componentInstance.userItem = this.userItem;
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.calendar.getCalendarPersoData(
          this.calendar.startDateCalendar,
          this.calendar.endDateCalendar,
          this.calendar.calendarComponent.getApi().view.type
        );
      }
    });
    dialogRef.componentInstance.clickedDate = this.clickedDate;
    dialogRef.componentInstance.mode = "modifier";
    dialogRef.componentInstance.id_evenement = this.id_evenement;
    dialogRef.componentInstance.evenement = this.itemEvenement;
    dialogRef.componentInstance.id_utilisateur =
      this.calendar.typeAgenda == "Un délégué de mon équipe"
        ? this.calendar.form.controls.id_utilisateur.value
        : null;
    dialogRef.componentInstance.typeEvenement =
      this.isPro(this.itemEvenement.code_evenement) ? 'pro' : 'norm';
    this.dialogRef.close();
  }
}
