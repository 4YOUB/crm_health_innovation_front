import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { ListeCodifService } from "app/service/liste-codif-service/liste-codif.service";
import { CurrentUserService } from "app/service/current-user.service";
import { AgendaService } from "app/service/agenda-service/agenda.service";
import Swal from "sweetalert2";
import * as moment from "moment";
import { MatInput } from "@angular/material/input";

@Component({
  selector: "ms-ajouter-evenement",
  templateUrl: "./ajouter-evenement.component.html",
  styleUrls: ["./ajouter-evenement.component.scss"],
})
export class AjouterEvenementComponent implements OnInit, AfterViewInit {
  @ViewChild("titre") titreInput: MatInput;
  @ViewChild("eventStartDateInput") eventStartDateInput: ElementRef;
  @ViewChild("eventEndDateInput") eventEndDateInput: ElementRef;

  isLoading = false;
  userItem;
  form: FormGroup;
  date_jour = moment(new Date()).format("YYYY-MM-DD");
  maxDate = moment(new Date()).format("YYYY-MM-DD");
  minDate = moment(new Date()).format("YYYY-MM-DD");
  visite: any = {};
  statut_realisee = false;
  // nbrJoursFutur = 0;
  nbrJoursPass = 0;
  listHours = [];
  hoursRangeStart = 0;
  hoursRangeEnd = 23;
  listTypesEvenement = [];
  clickedDate;
  listNotAllDay = ["Formation", "Absence", "Réunion Interne", "Séminaire", "Congrès"];
  id_utilisateur;
  mode: string = "ajouter";
  id_evenement;
  evenement;
  typeEvenement = "norm";
  listTypesEvenementPro = [
    { libelle_codification: "Formation", code_codification: "FORM" },
    { libelle_codification: "Réunion Interne", code_codification: "REIN" },
    { libelle_codification: "Séminaire", code_codification: "SMNR" },
    { libelle_codification: "Congrès", code_codification: "CNGR" }
  ];

  constructor(
    public dialogRef: MatDialogRef<AjouterEvenementComponent>,
    private agendaService: AgendaService,
    private formBuilder: FormBuilder,
    private listeCodifService: ListeCodifService,
    private _currentUser: CurrentUserService
  ) { }

  ngOnInit(): void {
    // this.get_hours_range();
    this.initHours();
    this.getInfos();
    this.get_nbr_jours();
    this.getTypesEvenement();
  }

  ngAfterViewInit(): void {
    this.titreInput?.focus();
  }

  get_hours_range() {
    this.listeCodifService.get_hours_range().subscribe((res: any) => {
      this.hoursRangeStart = Number(res["HRSTART"].libelle_codification);
      this.hoursRangeEnd = Number(res["HREND"].libelle_codification);
      this.initHours();
    });
  }
  initHours() {
    for (let i = this.hoursRangeStart; i <= this.hoursRangeEnd; i++) {
      if (String(i).length == 1) {
        this.listHours.push(`0${i}:00`);
        this.listHours.push(`0${i}:30`);
      } else {
        this.listHours.push(`${i}:00`);
        this.listHours.push(`${i}:30`);
      }
    }
    // this.listHours.push("24:00");
  }
  get_nbr_jours() {
    this.listeCodifService.get_nbr_jours().subscribe((res: any) => {
      // this.nbrJoursFutur = res["JRFUTUR"].libelle_codification;
      this.nbrJoursPass = res["JRPASS"].libelle_codification;
      this.minDate = moment(new Date())
        .subtract(this.nbrJoursPass, "days")
        .format("YYYY-MM-DD");
    });
  }
  getInfos() {
    this._currentUser.getInfos().subscribe(
      (res: any) => {
        this.date_jour = moment(res.date_jour).format("YYYY-MM-DD");
        this.maxDate = this.date_jour;
        this.minDate = this.date_jour;
      },
      (err) => { }
    );
  }
  initForm(data?) {
    let hour_deb_evenement;
    let hour_fin_evenement;
    if (this.clickedDate) {
      hour_deb_evenement = moment(this.clickedDate).format("HH:mm");
      hour_fin_evenement = moment(this.clickedDate)
        .add(1, "hours")
        .format("HH:mm");
    } else {
      const reminder = 60 - (moment(this.clickedDate).minutes() % 60);
      hour_deb_evenement = moment(this.clickedDate)
        .add(reminder, "minutes")
        .format("HH:mm");
      hour_fin_evenement = moment(this.clickedDate)
        .add(reminder + 60, "minutes")
        .format("HH:mm");
    }
    this.form = this.formBuilder.group({
      code_evenement: data
        ? [...this.listTypesEvenement, ...this.listTypesEvenementPro].find(
          (te) => te.code_codification == data.code_evenement
        )
        : null,
      titre: data ? data.titre : null,
      date_deb_evenement: [
        data
          ? moment(data.date_deb_evenement, "DD/MM/YYYY HH:mm").format(
            "YYYY-MM-DD"
          )
          : this.clickedDate
            ? moment(this.clickedDate).format("YYYY-MM-DD")
            : this.date_jour,
        [],
      ],
      date_fin_evenement: [
        data
          ? moment(data.date_fin_evenement, "DD/MM/YYYY HH:mm").format(
            "YYYY-MM-DD"
          )
          : this.clickedDate
            ? moment(this.clickedDate).format("YYYY-MM-DD")
            : this.date_jour,
        [],
      ],
      hour_deb_evenement: data
        ? moment(data.date_deb_evenement, "DD/MM/YYYY HH:mm").format("HH:mm")
        : hour_deb_evenement,
      hour_fin_evenement: data
        ? moment(data.date_fin_evenement, "DD/MM/YYYY HH:mm").format("HH:mm")
        : hour_fin_evenement,
      lieu: data ? data.lieu : null,
      commentaire: data ? data.commentaire : null,
    });
  }

  getEvenement() {
    this.isLoading = true;

    this.agendaService.getFicheEvenementAgenda(this.id_evenement).subscribe(
      (res: any) => {
        let evenement = {
          ...res.evenement,
          date_deb_evenement: ["FORM", "EABS"].includes(
            res.evenement.code_evenement
          )
            ? moment(res.evenement.date_deb_evenement).format(
              "DD/MM/YYYY HH:mm"
            )
            : moment(res.evenement.date_deb_evenement).format("DD/MM/YYYY"),
          date_fin_evenement: ["FORM", "EABS"].includes(
            res.evenement.code_evenement
          )
            ? moment(res.evenement.date_fin_evenement).format(
              "DD/MM/YYYY HH:mm"
            )
            : moment(res.evenement.date_fin_evenement).format("DD/MM/YYYY"),
        };
        this.initForm(evenement);
        this.isLoading = false;
      },
      (err) => {
        this.showMessageError();
      }
    );
  }

  getTypesEvenement() {
    this.isLoading = true;
    this.listeCodifService.getTypesEvenement().subscribe(
      (res: any) => {
        this.listTypesEvenement = res.types_evenement
          .filter(te => !this.listTypesEvenementPro.map(te => te.code_codification).includes(te.code_codification));
        if (this.id_evenement && this.evenement && this.mode == "modifier") {
          this.initForm(this.evenement);
        } else {
          this.initForm();
          this.form.controls.code_evenement.setValue(
            (this.typeEvenement != 'pro' ? this.listTypesEvenement : this.listTypesEvenementPro)[0]
          );
        }
        this.isLoading = false;
      },
      (err) => {
        // this.showMessageError();
        this.isLoading = false;
      }
    );
  }

  reset() {
    this.initForm();
  }

  typeEventSelected(event, type) {
    this.form.controls.code_evenement.setValue(type);
    this.titreInput?.focus();
  }

  // is24(time) {
  //   if(time == "24:00") return "23:59";
  //   else return time;
  // }

  save() {
    let titre = this.form.controls.titre.value;
    let code_evenement =
      this.form.controls.code_evenement.value.code_codification;
    let type_evenement = "INDI";
    let date_deb, date_fin, date_deb_evenement, date_fin_evenement;
    date_deb = this.eventStartDateInput.nativeElement.value;
    date_fin = this.eventEndDateInput.nativeElement.value;

    // if (
    //   this.typeEvenement != 'pro' && 
    //   this.listNotAllDay.includes(
    //     this.form.controls.code_evenement.value?.libelle_codification
    //   )
    // ) {
    //   if (this.typeEvenement != 'pro' && (!titre || String(this.form.controls.titre.value).trim() == "")) {
    //     Swal.fire({
    //       icon: "warning",
    //       text: `Veuillez ajouter un titre !`,
    //       showConfirmButton: false,
    //       heightAuto: false,
    //       timer: 2500,
    //     });
    //     return;
    //   }
    // } else {
    // titre = code_evenement == "MALD" ? "Maladie" : "Congé";
    titre = [...this.listTypesEvenement, ...this.listTypesEvenementPro].find(
      (te) => te.code_codification == code_evenement
    ).libelle_codification;
    // }

    if (date_deb && date_fin) {
      if (
        moment(date_deb, "DD/MM/YYYY", true).isValid() &&
        moment(date_fin, "DD/MM/YYYY", true).isValid()
      ) {
        if (
          this.listNotAllDay.includes(
            this.form.controls.code_evenement.value?.libelle_codification
          )
        ) {
          date_deb_evenement =
            moment(date_deb, "DD/MM/YYYY").format("YYYY-MM-DD") +
            " " +
            this.form.controls.hour_deb_evenement.value;
          date_fin_evenement =
            moment(date_fin, "DD/MM/YYYY").format("YYYY-MM-DD") +
            " " +
            this.form.controls.hour_fin_evenement.value;
        } else {
          date_deb_evenement = moment(date_deb, "DD/MM/YYYY").format(
            "YYYY-MM-DD"
          );
          date_fin_evenement =
            moment(date_fin, "DD/MM/YYYY").format("YYYY-MM-DD") + " 23:59";
        }
        if (moment(date_deb_evenement).isSameOrAfter(date_fin_evenement)) {
          Swal.fire({
            icon: "warning",
            text: `Veuillez choisir une période valide !`,
            showConfirmButton: false,
            heightAuto: false,
            timer: 2500,
          });
        } else {
          const body = {
            id_utilisateur: this.id_utilisateur,
            code_evenement,
            type_evenement,
            titre,
            date_deb_evenement,
            date_fin_evenement,
            lieu: this.form.controls.lieu.value,
            commentaire: this.form.controls.commentaire.value
          };
          if (this.id_evenement && this.mode == "modifier") {
            this.agendaService
              .editEvenementAgenda(this.id_evenement, body)
              .subscribe(
                (res: any) => {
                  this.showMessageSuc(
                    `Votre événement a été modifiée avec succès`
                  );
                },
                (err) => {
                  if (err.status == 409) {
                    let info = err.error;
                    let message;
                    let s = info.conflictCount > 1 ? "s" : "";
                    if (info.conflictSource == "evenement") {
                      message = `La période choisie est occupé par ${info.conflictCount} évènement${s} !`;
                      Swal.fire({
                        icon: "warning",
                        text: message,
                        showConfirmButton: false,
                        heightAuto: false,
                        timer: 2500,
                      });
                    } else if (info.conflictSource == "visite") {
                      message = `
                      La période choisie est occupé par ${info.conflictCount
                        } visite${s}.
                      Voulez-vous supprimer ${s ? "ces" : "cette"} visite${s} ?
                    `;
                      Swal.fire({
                        text: message,
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
                          this.agendaService
                            .suppVisitesAgenda({
                              id_utilisateur: this.id_utilisateur,
                              visites_ids: info.ids,
                              operation: "modifier",
                              id_evenement: this.id_evenement,
                              ...body,
                            })
                            .subscribe(
                              (res) => {
                                this.showMessageSuc(
                                  "Operation effectuée avec succès"
                                );
                              },
                              (err) => {
                                this.showMessageError();
                              }
                            );
                        }
                      });
                    }
                  } else {
                    this.showMessageError();
                  }
                }
              );
          } else {
            this.agendaService.ajouterEvenement(body).subscribe(
              (res: any) => {
                this.showMessageSuc(
                  `Votre événement a été ajoutée avec succès`
                );
              },
              (err) => {
                if (err.status == 409) {
                  let info = err.error;
                  let message;
                  let s = info.conflictCount > 1 ? "s" : "";
                  if (info.conflictSource == "evenement") {
                    message = `La période choisie est occupé par ${info.conflictCount} évènement${s} !`;
                    Swal.fire({
                      icon: "warning",
                      text: message,
                      showConfirmButton: false,
                      heightAuto: false,
                      timer: 2500,
                    });
                  } else if (info.conflictSource == "visite") {
                    message = `
                      La période choisie est occupé par ${info.conflictCount
                      } visite${s}.
                      Voulez-vous supprimer ${s ? "ces" : "cette"} visite${s} ?
                    `;
                    Swal.fire({
                      text: message,
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
                        this.agendaService
                          .suppVisitesAgenda({
                            id_utilisateur: this.id_utilisateur,
                            visites_ids: info.ids,
                            operation: "ajouter",
                            id_evenement: this.id_evenement,
                            ...body,
                          })
                          .subscribe(
                            (res) => {
                              this.showMessageSuc(
                                "Operation effectuée avec succès"
                              );
                            },
                            (err) => {
                              this.showMessageError();
                            }
                          );
                      }
                    });
                  }
                } else {
                  this.showMessageError();
                }
              }
            );
          }
        }
      } else {
        Swal.fire({
          icon: "warning",
          text: `Veuillez choisir une période valide !`,
          showConfirmButton: false,
          heightAuto: false,
          timer: 2500,
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        text: `Veuillez choisir une période valide !`,
        showConfirmButton: false,
        heightAuto: false,
        timer: 2500,
      });
    }
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

  showMessageSuc(msg) {
    Swal.fire({
      icon: "success",
      text: msg,
      showConfirmButton: true,
      heightAuto: false,
      timer: 4000,
    });
    this.dialogRef.close(true);
  }

  showMessageError() {
    Swal.fire({
      icon: "error",
      title: `Une erreur est survenue`,
      text: "Veuillez réessayer plus tard",
      showConfirmButton: false,
      heightAuto: false,
      timer: 2500,
    });
  }
}
