import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PageTitleService } from "app/core/page-title/page-title.service";
import { CurrentUserService } from "app/service/current-user.service";
import { ListeCodifService } from "app/service/liste-codif-service/liste-codif.service";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import Swal from "sweetalert2";
import {
  CalendarOptions,
  FullCalendarComponent,
  ViewApi,
} from "@fullcalendar/angular";
import frLocale from "@fullcalendar/core/locales/fr";
import { AgendaService } from "app/service/agenda-service/agenda.service";
import { MatDialog } from "@angular/material/dialog";
import { FicheVisiteAgendaComponent } from "../fiche-visite-agenda/fiche-visite-agenda.component";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { MoreInfoDialogComponent } from "../more-info-dialog/more-info-dialog.component";
import { ParamsAppService } from "../../service/params-app-service/params-app.service";
import { AjouterEvenementComponent } from "../ajouter-evenement/ajouter-evenement.component";
import { ActionsDialogComponent } from "../actions-dialog/actions-dialog.component";
import { FicheEvenementAgendaComponent } from "../fiche-evenement-agenda/fiche-evenement-agenda.component";
import { AjouterVisiteComponent } from "app/visite/ajouter-visite/ajouter-visite.component";

@Component({
  selector: "ms-agenda-delegue",
  templateUrl: "./agenda-delegue.component.html",
  styleUrls: ["./agenda-delegue.component.scss"],
})
export class AgendaDelegueComponent implements OnInit {
  // references the #calendar in the template
  @ViewChild("calendar") calendarComponent: FullCalendarComponent;

  isLoading = false;
  calendarOptions: CalendarOptions;
  dataAgenda = [];
  startDateCalendar;
  endDateCalendar;
  form: FormGroup;
  idUtilisateur;
  listeUtilisateurs = [];
  dureeVisite = "1:00";
  HoursFilter = "1:00";
  HoursOptions = ["1:00", "2:00", "3:00", "4:00", "8:00", "12:00"]
  listStatusColors;
  typeAgenda = "Un délégué de mon équipe";
  listTypesAgenda = [
    "Mon Agenda",
    // "Mon équipe", 
    "Un délégué de mon équipe"];
  userItem;
  nbrJoursPass = 0;
  filtreStatus = "P";
  evenements;
  visites;
  hoursRangeStart = 0;
  hoursRangeEnd = 23;
  filtreP = true;
  filtreNP = true;
  filtreE = true;
  filtreEP = true;
  semaineParDefault
  listRapportAgenda = ["Rapport équipe"];
  dateParam = moment(new Date()).format("YYYY-MM-DD");

  constructor(
    private pageTitleService: PageTitleService,
    private agendaService: AgendaService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private listeCodifService: ListeCodifService,
    private paramsAppService: ParamsAppService,
    private _currentUser: CurrentUserService
  ) {
    moment.locale("fr");
    this.userItem = this._currentUser.getRoleCurrentUser();
  }

  ngOnInit(): void {
    this.initForm();
    this.get_app_params();
    setTimeout(() => {
      this.pageTitleService.setTitle("Agenda Délégué");
    }, 0);
    this.getUtilisateurs();
    this.initCalendarPerso();
  }

  onFiltreStatusChange(filterType) {

    if (this.typeAgenda == 'Rapport équipe') {

      if (filterType == "v") {
        this.filtreE = false;
        this.filtreEP = false;
      }
      else if (filterType == "e") {
        this.filtreP = false;
        this.filtreNP = false;
      }

      let codesEvenement = [];
      let codesVisite = [];
      if (this.filtreE) {
        codesEvenement.push("EABS", "CONG", "MALD")
      }
      if (this.filtreEP) {
        codesEvenement.push("REIN", "SMNR", "CNGR", "FORM")
      }
      if (this.filtreP) {
        codesVisite.push("PLAN")
      }
      if (this.filtreNP) {
        codesVisite.push("HOPL")
      }


      this.makeCalendarEquipeData(
        this.evenements.filter(e => codesEvenement.includes(e.code_evenement)),
        this.visites.filter(v => codesVisite.includes(v.code_type_visite)),
        this.calendarComponent.getApi().view.type
      );

      // switch (this.filtreStatus) {
      //   case "E":
      //     let listTypesEvenement = ["EABS", "CONG", "MALD"];
      //     this.makeCalendarEquipeData(
      //       this.evenements.filter(e => listTypesEvenement.includes(e.code_evenement)), 
      //       [], this.calendarComponent.getApi().view.type
      //     );          
      //     break; 
      //   case "EP":
      //     let listTypesEvenementPro = ["REIN", "SMNR", "CNGR", "FORM"];
      //     this.makeCalendarEquipeData(
      //       this.evenements.filter(e => listTypesEvenementPro.includes(e.code_evenement)), 
      //       [], this.calendarComponent.getApi().view.type
      //     );          
      //     break; 
      //   case "P":
      //     this.makeCalendarEquipeData(
      //       [], 
      //       this.visites.filter(v => v.code_type_visite == "PLAN"), 
      //       this.calendarComponent.getApi().view.type
      //     );
      //     break;
      //   case "NP":
      //     this.makeCalendarEquipeData(
      //       [], 
      //       this.visites.filter(v => v.code_type_visite == "HOPL"), 
      //       this.calendarComponent.getApi().view.type
      //     );
      //     break;
      //   default:
      //     this.makeCalendarEquipeData(
      //       this.evenements, 
      //       this.visites, 
      //       this.calendarComponent.getApi().view.type
      //     );
      //     break;
      // }

    }
    else {

      let codesEvenement = [];
      let codesVisite = [];
      if (this.filtreE) {
        codesEvenement.push("EABS", "CONG", "MALD")
      }
      if (this.filtreEP) {
        codesEvenement.push("REIN", "SMNR", "CNGR", "FORM")
      }
      if (this.filtreP) {
        codesVisite.push("PLAN")
      }
      if (this.filtreNP) {
        codesVisite.push("HOPL")
      }


      this.makeCalendarPersoData(
        this.evenements.filter(e => codesEvenement.includes(e.code_evenement)),
        this.visites.filter(v => codesVisite.includes(v.code_type_visite)),
        this.calendarComponent.getApi().view.type
      );

    }

    this.dataAgenda = this.dataAgenda;
    this.calendarOptions.events = this.dataAgenda;
    this.calendarComponent.getApi().render();
    this.updateCalendarSize();
  }

  get_app_params() {
    this.paramsAppService.get().then((params: any) => {
      this.listStatusColors = { ...params["CSTV"], ...params["CSTE"], CSVNP: params["CSVNP"] };
      this.dureeVisite = params["HEVI"]["DUREEVI"];
      this.nbrJoursPass = params["JOVI"]["JRPASSVI"];
      this.calendarOptions.defaultTimedEventDuration = this.dureeVisite;
      this.hoursRangeStart = Number(params["HEVI"]["HRSTART"]);
      this.hoursRangeEnd = Number(params["HEVI"]["HREND"]);
      this.semaineParDefault = params['SEDE']['SEPARDE']
      this.calendarOptions.initialView = this.semaineParDefault === "SDT" ? "workDaysView" : this.semaineParDefault === "SEM" ? "timeGridWeek" : "dayGridMonth"
      this.calendarComponent.getApi().changeView(this.calendarOptions.initialView)
      this.calendarComponent.getApi().scrollToTime("06:00")

      this.initCalendarPerso();
    });
  }

  // initForm() {
  //   this.form = this.formBuilder.group({
  //     id_utilisateur: [
  //       this.listeUtilisateurs.length
  //         ? this.listeUtilisateurs[0].code_codification
  //         : null,
  //     ],
  //   });
  // }

  initForm() {
    this.form = this.formBuilder.group({
      id_utilisateur: [null],
    });
  }

  getUtilisateurs() {
    this.listeCodifService.getUtilisateurs().subscribe(
      (res: any) => {
        const utilisateurs = res.utilisateurs
          .filter((u) => u.nom_utilisateur != "Mes activités")
          .map((item) => {
            return {
              role: item.role,
              code_codification: item.id_utilisateur,
              libelle_codification: item.nom_utilisateur,
            };
          });
        this.listeUtilisateurs = utilisateurs;
        // this.initForm();
        this.form.controls.id_utilisateur.setValue(this.listeUtilisateurs.length
          ? this.listeUtilisateurs[0].code_codification
          : null);


        this.form.controls.id_utilisateur.valueChanges.subscribe(
          (value) => {
            this.initCalendar();
            this.getCalendarData();
          }
        );

      },
      (err) => { }
    );
  }

  setIsLoading(state) {
    this.isLoading = state;
    this.cd.detectChanges();
    if (this.isLoading) {
      this.calendarComponent
        .getApi()
        .el.querySelector(".fc-view-harness")
        .setAttribute("style", "display:none;");
    } else {
      this.calendarComponent
        .getApi()
        .el.querySelector(".fc-view-harness")
        .removeAttribute("style");
    }
  }

  resetStatusFilterEquipe() {
    this.filtreP = true;
    this.filtreNP = false;
    this.filtreE = false;
    this.filtreEP = false;
  }

  resetStatusFilter() {
    this.filtreP = true;
    this.filtreNP = true;
    this.filtreE = true;
    this.filtreEP = true;
  }

  sub;
  onTypeAgendaChange() {
    if (this.typeAgenda == "Rapport équipe") {
      this.resetStatusFilterEquipe();
    }
    else {
      this.resetStatusFilter();
    }

    this.initCalendar();
    this.getCalendarData();
    if (this.typeAgenda == "Un délégué de mon équipe") {
      this.sub = this.form.controls.id_utilisateur.valueChanges.subscribe(
        (value) => {
          this.initCalendar();
          this.getCalendarData();
        }
      );
    } else {
      this.sub?.unsubscribe();
    }
    this.calendarComponent.getApi().render();
    this.updateCalendarSize();
  }

  getStatusFromCode(code) {
    return (code == "REAL"
      ? "Réalisée"
      : code == "ENAT"
        ? "En Attente"
        : code == "ABSE"
          ? "Absent"
          : code == "REPL"
            ? "Replanifiée"
            : code == "EABS"
              ? "Absence"
              : code == "FORM"
                ? "Formation"
                : code == "CONG"
                  ? "Congé"
                  : code == "MALD"
                    ? "Maladie"
                    // : code == "STAF"
                    // ? "Staff"
                    : code == "REIN"
                      ? "Réunion Interne"
                      : code == "SMNR"
                        ? "Séminaire"
                        : code == "CNGR"
                          ? "Congrès"
                          : null);
  }

  getOrderStatusFromCode(code) {
    return (code == "REAL"
      ? 2
      : code == "ENAT"
        ? 1
        : code == "ABSE"
          ? 3
          : code == "REPL"
            ? 4
            : code == "EABS"
              ? 5
              : code == "FORM"
                ? 6
                : code == "CONG"
                  ? 7
                  : code == "MALD"
                    ? 8
                    // : code == "STAF"
                    // ? 9
                    : code == "REIN"
                      ? 10
                      : code == "SMNR"
                        ? 11
                        : code == "CNGR"
                          ? 12
                          : null);
  }


  initCalendar() {
    if (this.typeAgenda == "Rapport équipe") {
      this.initCalendarEquipe();
    } else {
      this.initCalendarPerso();
    }
  }

  initCalendarEquipe() {
    const _this = this
    this.calendarOptions = {
      initialView: "timeGridWeek",
      locale: frLocale,
      views: {
        workDaysView: {
          type: "timeGrid",
          duration: {
            // days: 7,
            weeks: 1,
          },
          buttonText: "Semaine de travail",
          hiddenDays: [0, 6], // Hide Sunday and Saturday?
          slotMinTime: String(this.hoursRangeStart).length == 1 ?
            "0" + this.hoursRangeStart + ":00" :
            this.hoursRangeStart + ":00",
          slotMaxTime: String(this.hoursRangeEnd).length == 1 ?
            "0" + this.hoursRangeEnd + ":00" :
            this.hoursRangeEnd + ":00"
        },
      },
      headerToolbar: {
        start: "today prev,next",
        center: "title",
        end: "dayGridMonth,timeGridWeek,workDaysView",
        // end: "dayGridMonth,timeGridWeek",
      },
      // dayMaxEvents: 3,
      slotDuration: this.HoursFilter,
      // slotLabelInterval : this.HoursFilter,
      // slotLabelFormat(data) {
      //   return _this.HoursFilter === "1:00"? moment(data.date).format("HH:mm") : moment(data.date).format("HH:mm") + " ~ " + moment(data.date).add(_this.HoursFilter, 'h').format("HH:mm");
      // },
      defaultTimedEventDuration: this.dureeVisite,
      nowIndicator: true,
      showNonCurrentDates: false,
      slotEventOverlap: false,
      // eventMaxStack: 2,
      eventOrder: "order",
      allDaySlot: false,
      datesSet: this.handleCalendarDatesSet.bind(this),
      eventClick: (info) => {
        if (info.event.extendedProps.delegues) {
          this.openDialogMoreInfo(
            info.event.extendedProps.delegues,
            info.event.extendedProps.type_event == "visite" ? "delegues-v" : "delegues-e"
          );
        }
      },
      events: this.dataAgenda,
      eventContent: (arg) => {
        let title = arg.event.title;
        let status = arg.event.extendedProps.statut;
        if (
          arg.view.type == "timeGridWeek" ||
          arg.view.type == "workDaysView"
        ) {
          if (isNaN(Number(title))) {
            return {
              html: `<div style="
                cursor:pointer;
                background:${arg.event.extendedProps.colorStatut};
                color:white;
                border-radius:3px;
                padding:4px 1px 1px 1px;
                width: 100%;
                height:100%;
                white-space: nowrap;
                overflow: hidden;
                display: flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                align-content: center;
                flex-wrap:wrap;
                "
                title="${title}" >
                <div
                style="
                  background:white;
                  width:17px;
                  height:17px;
                  margin:0 4px 0 3px;
                  display:flex;
                  justify-content:center;
                  border-radius:50%;
                  flex-shrink:0;
                  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%);
                "
                >
                </mat-icon>
                  <img src=${arg.event.extendedProps.code_type_partenaire == "MEDE"
                  ? "assets/icon/medecin.svg"
                  : "assets/icon/pharmacie.svg"
                } style="width:9px;${arg.event.extendedProps.code_type_partenaire == "MEDE"
                  ? "filter:invert(38%) sepia(87%) saturate(687%) hue-rotate(168deg) brightness(92%) contrast(79%);"
                  : "filter:invert(18%) sepia(63%) saturate(2536%) hue-rotate(101deg) brightness(91%) contrast(106%);"
                }" >
                </div>
                ${title}</div>`,
            };
          } else {
            return {
              html: `
              <div
                style="
                  cursor:pointer;
                  background:${arg.event.extendedProps.colorStatut};
                  color:white;
                  font-weight:bold;
                  font-size:1rem;
                  height:100%;
                  text-align:center;
                  max-width:100%;
                  border-radius:3px;
                  display: flex;
                  flex-direction:column;
                  align-items:center;
                  justify-content:center;
                  align-content: center;
                  flex-wrap:wrap;
                "
                title="${title}"
              >
              ${title}
              </div>
            `,
            };
          }
        } else if (arg.view.type == "dayGridMonth") {
          return {
            html: `
              <div
                ngbPopover="And here's some amazing content. It's very engaging. Right?" 
                popoverTitle="Popover title"
                placement="bottom"
                style="
                  cursor:pointer;
                  background:${arg.event.extendedProps.colorStatut};
                  color:white;
                  font-weight:bold;
                  width:fit-content;
                  height:1.5rem;
                  text-align:center;
                  line-height: 0.8rem;
                  border-radius: 1.5rem;
                  padding:7px;
                  min-width:1.5rem;
                  max-width:100%;
                "
                title="${this.getStatusFromCode(status) + " : " + title}"
              >
              ${this.getStatusFromCode(status) + " : " + title}
              </div>
            `,
          };
        }
      },
      viewDidMount: this.setCalendarToolbarButtonStyle.bind(this),
      viewWillUnmount: this.removeCalendarToolbarButtonStyle.bind(this),
    };
  }

  initCalendarPerso() {
    this.calendarOptions = {
      initialView: "workDaysView",
      locale: frLocale,
      views: {
        workDaysView: {
          type: "timeGrid",
          duration: {
            // days: 7,
            weeks: 1,
          },
          buttonText: "Semaine de travail",
          hiddenDays: [0, 6], // Hide Sunday and Saturday?
          slotMinTime: String(this.hoursRangeStart).length == 1 ?
            "0" + this.hoursRangeStart + ":00" :
            this.hoursRangeStart + ":00",
          slotMaxTime: String(this.hoursRangeEnd).length == 1 ?
            "0" + this.hoursRangeEnd + ":00" :
            this.hoursRangeEnd + ":00"
        },
      },
      headerToolbar: {
        start: "today prev,next",
        center: "title",
        end: "dayGridMonth,timeGridWeek,workDaysView",
        // end: "dayGridMonth,timeGridWeek",
      },
      slotDuration: this.HoursFilter,
      // slotLabelInterval : this.HoursFilter,
      dayMaxEvents: 5,
      defaultTimedEventDuration: this.dureeVisite,
      nowIndicator: true,
      showNonCurrentDates: false,
      slotEventOverlap: false,
      selectable: true,
      allDaySlot: false,
      datesSet: this.handleCalendarDatesSet.bind(this),
      eventClick: (info) => {
        if (info.event.extendedProps.type_event == "visite") {
          this.openDialogFicheVisiteAgenda(info.event.id);
        } else if (info.event.extendedProps.type_event == "event") {
          this.openDialogFicheEvenementAgenda(
            info.event.id,
            info.view.calendar.getDate()
          );
        }
      },
      events: this.dataAgenda,
      eventContent: (arg) => {
        let title = arg.event.title;
        if (arg.event.extendedProps.type_event == "visite") {
          if (
            arg.view.type == "timeGridWeek" ||
            arg.view.type == "workDaysView"
          ) {
            return {
              html: `<div style="
              cursor:pointer;
              background:${arg.event.backgroundColor};
              color:white;
              border-radius:3px;
              padding:4px 1px 1px 1px;
              width: 100%;
              height: 100%;
              white-space: nowrap;
              overflow: hidden;
              display: flex;
              align-items:center;
              flex-direction:column;
              justify-content:center;
              align-content: center;
              flex-wrap:wrap;
              "
              title="${title}" >
              <div
              style="
                background:white;
                width:17px;
                height:17px;
                margin:0 4px 0 2px;
                display:flex;
                justify-content:center;
                border-radius:50%;
                flex-shrink:0;
                box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%);
              " 
              > 
              </mat-icon>
                <img src=${arg.event.extendedProps.code_type_partenaire == "MEDE"
                  ? "assets/icon/medecin.svg"
                  : "assets/icon/pharmacie.svg"
                } style="width:9px;${arg.event.extendedProps.code_type_partenaire == "MEDE"
                  ? "filter:invert(38%) sepia(87%) saturate(687%) hue-rotate(168deg) brightness(92%) contrast(79%);"
                  : "filter:invert(18%) sepia(63%) saturate(2536%) hue-rotate(101deg) brightness(91%) contrast(106%);"
                }" >
              </div>
              ${title}</div>`,
            };
          } else if (arg.view.type == "dayGridMonth") {
            return {
              html: `<div style="
              cursor:pointer;
              background:${arg.event.backgroundColor};
              color:white;
              border-radius:3px;
              padding:1px;
              width: 100%;
              height: 100%;
              white-space: nowrap;
              overflow: hidden;
              display: flex;
              align-items:center;
              "
              title="${title}" >
              <div
              style="
                background:white;
                width:17px;
                height:17px;
                margin:0 4px 0 2px;
                display:flex;
                justify-content:center;
                border-radius:50%;
                flex-shrink:0;
                box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%);
              " 
              > 
              </mat-icon>
                <img src=${arg.event.extendedProps.code_type_partenaire == "MEDE"
                  ? "assets/icon/medecin.svg"
                  : "assets/icon/pharmacie.svg"
                } style="width:9px;${arg.event.extendedProps.code_type_partenaire == "MEDE"
                  ? "filter:invert(38%) sepia(87%) saturate(687%) hue-rotate(168deg) brightness(92%) contrast(79%);"
                  : "filter:invert(18%) sepia(63%) saturate(2536%) hue-rotate(101deg) brightness(91%) contrast(106%);"
                }" >
              </div>
              ${title}</div>`,
            };
          }
        } else if (arg.event.extendedProps.type_event == "event") {
          return {
            html: `<div style="
                cursor:pointer;
                background:${arg.event.backgroundColor};
                color:white;
                border-radius:3px;
                padding:1px 2px;
                width: 100%;
                height: 100%;
                overflow: hidden;
                display: flex;
                align-items:center;
                justify-content:center;
                text-align:center;
                "
                title="${title}" >
                ${title}</div>`,
          };
        }
      },
      viewDidMount: this.setCalendarToolbarButtonStyle.bind(this),
      viewWillUnmount: this.removeCalendarToolbarButtonStyle.bind(this),
      dateClick: (info) => {
        if (this.typeAgenda == "Un délégué de mon équipe") {
          // if(this.userItem.role != 'ADMI'){
          // this.openDialogAjouterEvenement(info.dateStr);
          this.openDialogActions(info.dateStr, info.view.type, true);
          // }
        } else {
          if (this.userItem.role == 'ADMI') {
            // this.openDialogAjouterEvenement(info.dateStr);
            this.openDialogActions(info.dateStr, info.view.type, true);
          }
          else {
            this.openDialogActions(info.dateStr, info.view.type);
          }
        }
      },
    };
  }

  setCalendarToolbarButtonStyle() {
    if (!document.querySelector("#setToolbarButtonStyle")) {
      let styleEl = document.createElement("style");
      styleEl.setAttribute("id", "setToolbarButtonStyle");
      let css = `
      .fc-toolbar button {
        background-color:#aa182d !important;
        border-color:#aa182d !important;
      }
      .fc-toolbar button:hover {
        background-color:#881324 !important;
        border-color:#881324 !important;
      }
      .fc-daygrid-event{
        background-color:transparent !important;
        border:transparent !important;
      }
      .fc-event{
        outline: none !important;
        box-shadow: none !important;
        background-color:transparent !important;
        border:transparent !important;
      }
      .fc-event:after{
        outline: none !important;
        box-shadow: none !important;
        background-color:transparent !important;
        border:transparent !important;
      }
      .fc-event:before{
        outline: none !important;
        box-shadow: none !important;
        background-color:transparent !important;
        border:transparent !important;
      }
      .fc-event:focus{
        outline: none !important;
        box-shadow: none !important;
        background-color:transparent !important;
        border:transparent !important;
        cursor:pointer;
      }
      .fc .fc-timegrid-axis-cushion{
        font-size:.9rem;
      }
      .fc .fc-timegrid-slot {
        height: 3em;
      }
      .fc-view-harness,
      .fc-workDaysView-view {
        height:calc(45rem + 31px)!important;
      }
    `;
      styleEl.appendChild(document.createTextNode(css));
      this.calendarComponent.getApi().el.after(styleEl);
    }
  }

  removeCalendarToolbarButtonStyle() {
    if (document.querySelector("#setToolbarButtonStyle")) {
      document.querySelector("#setToolbarButtonStyle")?.remove();
    }
  }

  getCalendarData() {
    if (this.typeAgenda == "Rapport équipe") {
      this.getCalendarEquipeData(
        this.startDateCalendar,
        this.endDateCalendar,
        this.calendarComponent.getApi().view.type
      );
    } else {
      this.getCalendarPersoData(
        this.startDateCalendar,
        this.endDateCalendar,
        this.calendarComponent.getApi().view.type
      );
    }
    // this.fixCalendarUI();
  }

  makeCalendarEquipeData(evenements, visites, viewType) {
    let events = [];
    if (viewType == "timeGridWeek" || viewType == "workDaysView") {

      let evenementsByDate = [];
      evenements.forEach((ev) => {

        // let isAllDay = ["MALD", "CONG"].includes(ev.code_evenement);
        let isAllDay = false;

        if (isAllDay) {

          for (
            let date = ev.date_deb_evenement;
            moment(date).isSameOrBefore(ev.date_fin_evenement);
            date = moment(date).add(1, "days")
          ) {
            evenementsByDate.push({
              isAllDay,
              date: moment(date).format("YYYY-MM-DD"),
              ...ev
            });
          }

        }
        else {

          for (
            let date = ev.date_deb_evenement;
            moment(date).isBefore(ev.date_fin_evenement);
            date = moment(date).add(1, "hours")
          ) {
            evenementsByDate.push({
              isAllDay,
              date: moment(date).format("YYYY-MM-DD HH:00"),
              ...ev
            });
          }

        }


      });


      evenementsByDate.forEach((ev) => {
        let eventIndex = events.findIndex(
          (e) =>
            e.code_evenement == ev.code_evenement &&
            e.date == ev.date
        );
        if (eventIndex != -1) {
          events[eventIndex].title = events[eventIndex].title + 1;
          let delIndex = events[eventIndex].delegues.findIndex(
            (d) => d.id_utilisateur == ev.id_utilisateur
          );
          if (delIndex != -1) {
            events[eventIndex].delegues[delIndex].nb_evenements += 1;
            events[eventIndex].delegues[delIndex].evenements.push({
              id: ev.id_evenement,
              date: moment(ev.date).format("LLL"),
              date_o: moment(ev.date).format("YYYY-MM-DD HH:mm"),
              hour: moment(ev.date).format("HH:mm"),
              titre: ev.titre,
              code_evenement: ev.code_evenement,
              colorStatut: this.listStatusColors[ev.code_evenement],
              nom_utilisateur: ev.nom_utilisateur,
            });
          } else {
            events[eventIndex].delegues.push({
              id_utilisateur: ev.id_utilisateur,
              date: events[eventIndex].date,
              nom_utilisateur: ev.nom_utilisateur,
              nb_evenements: 1,
              evenements: [
                {
                  id: ev.id_evenement,
                  date: moment(ev.date).format("LLL"),
                  date_o: moment(ev.date).format("YYYY-MM-DD HH:mm"),
                  hour: moment(ev.date).format("HH:mm"),
                  titre: ev.titre,
                  code_evenement: ev.code_evenement,
                  colorStatut: this.listStatusColors[ev.code_evenement],
                  nom_utilisateur: ev.nom_utilisateur,
                },
              ],
              colorStatut: this.listStatusColors[ev.code_evenement],
            });
          }
        } else {
          events.push({
            type_event: "event",
            id: ev.id_evenement,
            date: ev.date,
            code_evenement: ev.code_evenement,
            order: this.getOrderStatusFromCode(ev.code_evenement),
            title: 1,
            color: "white",
            colorStatut: this.listStatusColors[ev.code_evenement],
            delegues: [
              {
                id_utilisateur: ev.id_utilisateur,
                date: moment(ev.date).format("LLL"),
                nom_utilisateur: ev.nom_utilisateur,
                nb_evenements: 1,
                evenements: [
                  {
                    id: ev.id_evenement,
                    date: moment(ev.date).format("LLL"),
                    date_o: moment(ev.date).format("YYYY-MM-DD HH:mm"),
                    hour: moment(ev.date).format("HH:mm"),
                    code_evenement: ev.code_evenement,
                    titre: ev.titre,
                    colorStatut:
                      this.listStatusColors[ev.code_evenement],
                    nom_utilisateur: ev.nom_utilisateur,
                  },
                ],
                colorStatut: this.listStatusColors[ev.code_evenement],
              },
            ],
          });
          // }
        }
      });
    } else if (viewType == "dayGridMonth") {


      let evenementsByDate = [];
      evenements.forEach((ev) => {

        // let isAllDay = ["MALD", "CONG"].includes(ev.code_evenement);
        let isAllDay = false;


        for (
          let date = ev.date_deb_evenement;
          moment(date).isSameOrBefore(ev.date_fin_evenement);
          date = moment(date).add(1, "days")
        ) {
          evenementsByDate.push({
            isAllDay,
            date: moment(date).format("YYYY-MM-DD"),
            ...ev
          });
        }



      });


      evenementsByDate.forEach((ev) => {
        let eventIndex = events.findIndex(
          (e) =>
            e.date == ev.date &&
            e.code_evenement == ev.code_evenement
        );
        if (eventIndex != -1) {
          events[eventIndex].title = events[eventIndex].title + 1;
          let delIndex = events[eventIndex].delegues.findIndex(
            (d) => d.id_utilisateur == ev.id_utilisateur
          );
          if (delIndex != -1) {
            events[eventIndex].delegues[delIndex].nb_evenements += 1;
            events[eventIndex].delegues[delIndex].evenements?.push({
              id: ev.id_evenement,
              date: moment(ev.date).format("LL"),
              date_o: moment(ev.date).format("YYYY-MM-DD HH:mm"),
              hour: moment(ev.date).format("HH:mm"),
              code_evenement: ev.code_evenement,
              colorStatut: this.listStatusColors[ev.code_evenement],
              nom_utilisateur: ev.nom_utilisateur,
              titre: ev.titre,
            });
          } else {
            events[eventIndex].delegues.push({
              id_utilisateur: ev.id_utilisateur,
              date: events[eventIndex].date,
              nom_utilisateur: ev.nom_utilisateur,
              nb_evenements: 1,
              evenements: [
                {
                  id: ev.id_evenement,
                  date: moment(ev.date).format("LL"),
                  date_o: moment(ev.date).format("YYYY-MM-DD HH:mm"),
                  hour: moment(ev.date).format("HH:mm"),
                  code_evenement: ev.code_evenement,
                  colorStatut: this.listStatusColors[ev.code_evenement],
                  nom_utilisateur: ev.nom_utilisateur,
                  titre: ev.titre,
                },
              ],
              colorStatut: this.listStatusColors[ev.code_evenement],
            });
          }
        } else {
          events.push({
            type_event: "event",
            id: ev.id_evenement,
            date: ev.date,
            code_evenement: ev.code_evenement,
            statut: ev.code_evenement,
            order: this.getOrderStatusFromCode(ev.code_evenement),
            title: 1,
            color: "white",
            colorStatut: this.listStatusColors[ev.code_evenement],
            delegues: [
              {
                id_utilisateur: ev.id_utilisateur,
                date: moment(ev.date).format("LL"),
                nom_utilisateur: ev.nom_utilisateur,
                nb_evenements: 1,
                evenements: [
                  {
                    id: ev.id_evenement,
                    date: moment(ev.date).format("LL"),
                    date_o: moment(ev.date).format("YYYY-MM-DD HH:mm"),
                    hour: moment(ev.date).format("HH:mm"),
                    code_evenement: ev.code_evenement,
                    colorStatut:
                      this.listStatusColors[ev.code_evenement],
                    nom_utilisateur: ev.nom_utilisateur,
                    titre: ev.titre,
                  },
                ],
                colorStatut: this.listStatusColors[ev.code_evenement],
              },
            ],
          });
        }
      });
    }

    this.dataAgenda.push(...events);


    if (viewType == "timeGridWeek" || viewType == "workDaysView") {
      visites.forEach((v) => {
        let date_visite = moment(v.date_visite).format("YYYY-MM-DD HH:00");
        let eventIndex = events.findIndex(
          (e) =>
            e.date == moment(date_visite).format("YYYY-MM-DD HH:mm") &&
            e.statut == v.code_statut_visite
        );
        if (eventIndex != -1) {
          events[eventIndex].title = events[eventIndex].title + 1;
          let delIndex = events[eventIndex].delegues.findIndex(
            (d) => d.id_utilisateur == v.id_utilisateur
          );
          if (delIndex != -1) {
            events[eventIndex].delegues[delIndex].nb_visites += 1;
            events[eventIndex].delegues[delIndex].visites.push({
              id: v.id_visite,
              date: moment(date_visite).format("LLL"),
              date_o: moment(date_visite).format("YYYY-MM-DD HH:mm"),
              hour: moment(v.date_visite).format("HH:mm"),
              nom_partenaire: v.nom_partenaire,
              code_type_partenaire: v.code_type_partenaire,
              code_statut_visite: v.code_statut_visite,
              colorStatut: v.code_type_visite == 'PLAN' ?
                this.listStatusColors[v.code_statut_visite] :
                this.listStatusColors['CSVNP'][v.code_statut_visite],
              nom_utilisateur: v.nom_utilisateur,
            });
          } else {
            events[eventIndex].delegues.push({
              id_utilisateur: v.id_utilisateur,
              date: moment(date_visite).format("LLL"),
              nom_utilisateur: v.nom_utilisateur,
              nb_visites: 1,
              visites: [
                {
                  id: v.id_visite,
                  date: moment(date_visite).format("LLL"),
                  date_o: moment(date_visite).format("YYYY-MM-DD HH:mm"),
                  hour: moment(v.date_visite).format("HH:mm"),
                  nom_partenaire: v.nom_partenaire,
                  code_type_partenaire: v.code_type_partenaire,
                  code_statut_visite: v.code_statut_visite,
                  colorStatut: v.code_type_visite == 'PLAN' ?
                    this.listStatusColors[v.code_statut_visite] :
                    this.listStatusColors['CSVNP'][v.code_statut_visite],
                  nom_utilisateur: v.nom_utilisateur,
                },
              ],
              colorStatut: v.code_type_visite == 'PLAN' ?
                this.listStatusColors[v.code_statut_visite] :
                this.listStatusColors['CSVNP'][v.code_statut_visite],
            });
          }
        } else {
          events.push({
            type_event: "visite",
            date: moment(date_visite).format("YYYY-MM-DD HH:mm"),
            statut: v.code_statut_visite,
            order: this.getOrderStatusFromCode(v.code_statut_visite),
            nom_partenaire: v.nom_partenaire,
            code_type_partenaire: v.code_type_partenaire,
            title: 1,
            color: "white",
            colorStatut: v.code_type_visite == 'PLAN' ?
              this.listStatusColors[v.code_statut_visite] :
              this.listStatusColors['CSVNP'][v.code_statut_visite],
            delegues: [
              {
                id_utilisateur: v.id_utilisateur,
                date: moment(date_visite).format("LLL"),
                nom_utilisateur: v.nom_utilisateur,
                nb_visites: 1,
                visites: [
                  {
                    id: v.id_visite,
                    date: moment(date_visite).format("LLL"),
                    date_o: moment(date_visite).format(
                      "YYYY-MM-DD HH:mm"
                    ),
                    hour: moment(v.date_visite).format("HH:mm"),
                    nom_partenaire: v.nom_partenaire,
                    code_type_partenaire: v.code_type_partenaire,
                    code_statut_visite: v.code_statut_visite,
                    colorStatut:
                      v.code_type_visite == 'PLAN' ?
                        this.listStatusColors[v.code_statut_visite] :
                        this.listStatusColors['CSVNP'][v.code_statut_visite],
                    nom_utilisateur: v.nom_utilisateur,
                  },
                ],
                colorStatut: v.code_type_visite == 'PLAN' ?
                  this.listStatusColors[v.code_statut_visite] :
                  this.listStatusColors['CSVNP'][v.code_statut_visite],
              },
            ],
          });
        }
      });
    } else if (viewType == "dayGridMonth") {
      visites.forEach((v) => {
        let eventIndex = events.findIndex(
          (e) =>
            e.date == moment(v.date_visite).format("YYYY-MM-DD") &&
            e.statut == v.code_statut_visite
        );
        if (eventIndex != -1) {
          events[eventIndex].title = events[eventIndex].title + 1;
          let delIndex = events[eventIndex].delegues.findIndex(
            (d) => d.id_utilisateur == v.id_utilisateur
          );
          if (delIndex != -1) {
            events[eventIndex].delegues[delIndex].nb_visites += 1;
            events[eventIndex].delegues[delIndex].visites?.push({
              id: v.id_visite,
              date: moment(v.date_visite).format("LL"),
              date_o: moment(v.date_visite).format("YYYY-MM-DD HH:mm"),
              hour: moment(v.date_visite).format("HH:mm"),
              nom_partenaire: v.nom_partenaire,
              code_type_partenaire: v.code_type_partenaire,
              code_statut_visite: v.code_statut_visite,
              colorStatut: v.code_type_visite == 'PLAN' ?
                this.listStatusColors[v.code_statut_visite] :
                this.listStatusColors['CSVNP'][v.code_statut_visite],
              nom_utilisateur: v.nom_utilisateur,
            });
          } else {
            events[eventIndex].delegues.push({
              id_utilisateur: v.id_utilisateur,
              date: moment(v.date_visite).format("LL"),
              nom_utilisateur: v.nom_utilisateur,
              nb_visites: 1,
              visites: [
                {
                  id: v.id_visite,
                  date: moment(v.date_visite).format("LL"),
                  date_o: moment(v.date_visite).format("YYYY-MM-DD HH:mm"),
                  hour: moment(v.date_visite).format("HH:mm"),
                  nom_partenaire: v.nom_partenaire,
                  code_type_partenaire: v.code_type_partenaire,
                  code_statut_visite: v.code_statut_visite,
                  colorStatut: v.code_type_visite == 'PLAN' ?
                    this.listStatusColors[v.code_statut_visite] :
                    this.listStatusColors['CSVNP'][v.code_statut_visite],
                  nom_utilisateur: v.nom_utilisateur,
                },
              ],
              colorStatut: v.code_type_visite == 'PLAN' ?
                this.listStatusColors[v.code_statut_visite] :
                this.listStatusColors['CSVNP'][v.code_statut_visite],
            });
          }
        } else {
          events.push({
            type_event: "visite",
            date: moment(v.date_visite).format("YYYY-MM-DD"),
            statut: v.code_statut_visite,
            order: this.getOrderStatusFromCode(v.code_statut_visite),
            title: 1,
            color: "white",
            colorStatut: v.code_type_visite == 'PLAN' ?
              this.listStatusColors[v.code_statut_visite] :
              this.listStatusColors['CSVNP'][v.code_statut_visite],
            delegues: [
              {
                id_utilisateur: v.id_utilisateur,
                date: moment(v.date_visite).format("LL"),
                nom_utilisateur: v.nom_utilisateur,
                nb_visites: 1,
                visites: [
                  {
                    id: v.id_visite,
                    date: moment(v.date_visite).format("LL"),
                    date_o: moment(v.date_visite).format(
                      "YYYY-MM-DD HH:mm"
                    ),
                    hour: moment(v.date_visite).format("HH:mm"),
                    nom_partenaire: v.nom_partenaire,
                    code_type_partenaire: v.code_type_partenaire,
                    code_statut_visite: v.code_statut_visite,
                    colorStatut:
                      v.code_type_visite == 'PLAN' ?
                        this.listStatusColors[v.code_statut_visite] :
                        this.listStatusColors['CSVNP'][v.code_statut_visite],
                    nom_utilisateur: v.nom_utilisateur,
                  },
                ],
                colorStatut: v.code_type_visite == 'PLAN' ?
                  this.listStatusColors[v.code_statut_visite] :
                  this.listStatusColors['CSVNP'][v.code_statut_visite],
              },
            ],
          });
        }
      });
    }
    this.dataAgenda = events;
  }

  getCalendarEquipeData(startDate, endDate, viewType) {
    this.setIsLoading(true);
    let events = [];
    const body = {
      date_debut_visite: startDate,
      date_fin_visite: endDate,
    };

    this.agendaService
      .getEvenementsEquipe({
        date_debut_evenements: startDate,
        date_fin_evenements: endDate,
      })
      .subscribe(
        (res: any) => {
          this.evenements = res.evenements;
        },
        (err) => {
          this.showMessageError();
        }
      );

    this.agendaService.getAgendaEquipe(body).subscribe(
      (res: any) => {
        this.visites = res.visites;

        let codesEvenement = [];
        let codesVisite = [];
        if (this.filtreE) {
          codesEvenement.push("EABS", "CONG", "MALD")
        }
        if (this.filtreEP) {
          codesEvenement.push("REIN", "SMNR", "CNGR", "FORM")
        }
        if (this.filtreP) {
          codesVisite.push("PLAN")
        }
        if (this.filtreNP) {
          codesVisite.push("HOPL")
        }


        this.makeCalendarEquipeData(
          this.evenements.filter(e => codesEvenement.includes(e.code_evenement)),
          this.visites.filter(v => codesVisite.includes(v.code_type_visite)),
          this.calendarComponent.getApi().view.type
        );

        // switch (this.filtreStatus) {
        //   case "E":
        //     let listTypesEvenement = ["EABS", "CONG", "MALD"];
        //     this.makeCalendarEquipeData(
        //       this.evenements.filter(e => listTypesEvenement.includes(e.code_evenement)), 
        //       [], this.calendarComponent.getApi().view.type
        //     );          
        //     break; 
        //   case "EP":
        //     let listTypesEvenementPro = ["REIN", "SMNR", "CNGR", "FORM"];
        //     this.makeCalendarEquipeData(
        //       this.evenements.filter(e => listTypesEvenementPro.includes(e.code_evenement)), 
        //       [], this.calendarComponent.getApi().view.type
        //     );          
        //     break; 
        //   case "P":
        //     this.makeCalendarEquipeData(
        //       [], 
        //       this.visites.filter(v => v.code_type_visite == "PLAN"), 
        //       this.calendarComponent.getApi().view.type
        //     );
        //     break;
        //   case "NP":
        //     this.makeCalendarEquipeData(
        //       [], 
        //       this.visites.filter(v => v.code_type_visite == "HOPL"), 
        //       this.calendarComponent.getApi().view.type
        //     );
        //     break;
        //   default:
        //     this.makeCalendarEquipeData(
        //       this.evenements, 
        //       this.visites, 
        //       this.calendarComponent.getApi().view.type
        //     );
        //     break;
        // }

        this.calendarOptions.events = this.dataAgenda;
        this.setIsLoading(false);
        this.calendarComponent.getApi().render();
        this.updateCalendarSize();
      },
      (err) => {
        this.setIsLoading(false);
        this.updateCalendarSize();
      }
    );
  }

  makeCalendarPersoData(evenements, visites, viewType) {
    let events = [];

    events = visites.map((v) => {
      return {
        id: v.id_visite,
        title: `${String(v.nom_partenaire).trim()}`,
        start: v.date_visite,
        end: moment(v.date_visite, 'YYYY-MM-DD').format('YYYY-MM-DD') + ' ' + moment(v.heure_fin_visite, 'HH:mm:ss').format('HH:mm:ss'),
        color: v.code_type_visite == 'PLAN' ?
          this.listStatusColors[v.code_statut_visite] :
          this.listStatusColors['CSVNP'][v.code_statut_visite],
        code_type_visite: v.code_type_visite,
        code_type_partenaire: v.code_type_partenaire,
        type_event: "visite",
      };
    });

    events.push(
      ...evenements.map((e) => {
        // let isAllDay = ["MALD", "CONG"].includes(e.code_evenement);
        let isAllDay = false;
        return {
          id: e.id_evenement,
          title: `${String(e.titre).trim()}`,
          start: isAllDay
            ? moment(e.date_deb_evenement).format("YYYY-MM-DD")
            : e.date_deb_evenement,
          end: isAllDay
            ? moment(e.date_fin_evenement)
              .add(1, "days")
              .format("YYYY-MM-DD")
            : e.date_fin_evenement,
          color: this.listStatusColors[e.code_evenement],
          type_event: "event",
          // allDay: isAllDay
        };
      })
    );

    this.dataAgenda = events;
  }

  getCalendarPersoData(startDate, endDate, viewType) {
    this.setIsLoading(true);
    let events = [];

    this.agendaService
      .getAgenda({
        date_debut_visite: startDate,
        date_fin_visite: endDate,
        id_utilisateur:
          this.typeAgenda == "Un délégué de mon équipe"
            ? this.form.controls["id_utilisateur"].value
            : null,
      })
      .subscribe(
        (res: any) => {
          this.visites = res.visites;

          // events = res.visites.map((v) => {
          //   return {
          //     id: v.id_visite,
          //     title: `${String(v.nom_partenaire).trim()}`,
          //     start: v.date_visite,
          //     color: v.code_type_visite == 'PLAN' ? 
          //     this.listStatusColors[v.code_statut_visite] : 
          //     this.listStatusColors['CSVNP'][v.code_statut_visite],
          //     code_type_visite: v.code_type_visite,
          //     code_type_partenaire: v.code_type_partenaire,
          //     type_event: "visite",
          //   };
          // });
          this.agendaService
            .getEvenements({
              date_debut_evenements: startDate,
              date_fin_evenements: endDate,
              id_utilisateur:
                this.typeAgenda == "Un délégué de mon équipe"
                  ? this.form.controls["id_utilisateur"].value
                  : null,
            })
            .subscribe(
              (res: any) => {
                this.evenements = res.evenements;

                // events.push(
                //   ...res.evenements.map((e) => {
                //     // let isAllDay = ["MALD", "CONG"].includes(e.code_evenement);
                //     let isAllDay = false;
                //     return {
                //       id: e.id_evenement,
                //       title: `${String(e.titre).trim()}`,
                //       start: isAllDay
                //         ? moment(e.date_deb_evenement).format("YYYY-MM-DD")
                //         : e.date_deb_evenement,
                //       end: isAllDay
                //         ? moment(e.date_fin_evenement)
                //             .add(1, "days")
                //             .format("YYYY-MM-DD")
                //         : e.date_fin_evenement,
                //       color: this.listStatusColors[e.code_evenement],
                //       type_event: "event",
                //       // allDay: isAllDay
                //     };
                //   })
                // );
                // this.dataAgenda = events;

                let codesEvenement = [];
                let codesVisite = [];
                if (this.filtreE) {
                  codesEvenement.push("EABS", "CONG", "MALD")
                }
                if (this.filtreEP) {
                  codesEvenement.push("REIN", "SMNR", "CNGR", "FORM")
                }
                if (this.filtreP) {
                  codesVisite.push("PLAN")
                }
                if (this.filtreNP) {
                  codesVisite.push("HOPL")
                }


                this.makeCalendarPersoData(
                  this.evenements.filter(e => codesEvenement.includes(e.code_evenement)),
                  this.visites.filter(v => codesVisite.includes(v.code_type_visite)),
                  this.calendarComponent.getApi().view.type
                );


                this.calendarOptions.events = this.dataAgenda;
                this.setIsLoading(false);
                this.calendarComponent.getApi().render();
                this.updateCalendarSize();
              },
              (err) => {
                this.setIsLoading(false);
                this.showMessageError();
                this.updateCalendarSize();
              }
            );
        },
        (err) => {
          this.setIsLoading(false);
          this.showMessageError();
          this.updateCalendarSize();
        }
      );
  }

  updateCalendarSize() {
    this.calendarComponent.getApi().updateSize();
  }

  fixCalendarUI() {
    this.calendarComponent.getApi().render();
    let dayGridMonthButton = this.calendarComponent
      .getApi()
      .el.querySelector(".fc-dayGridMonth-button");
    let timeGridWeekButton = this.calendarComponent
      .getApi()
      .el.querySelector(".fc-timeGridWeek-button");
    let workWeekButton = this.calendarComponent
      .getApi()
      .el.querySelector(".fc-workDaysView-button");
    if (this.calendarComponent.getApi().view.type == "timeGridWeek") {
      timeGridWeekButton.setAttribute(
        "style",
        "background-color:#881324 !important;"
      );
      dayGridMonthButton.removeAttribute("style");
      workWeekButton.removeAttribute("style");
      setTimeout(() => { this.calendarComponent?.getApi().scrollToTime(moment().hours(this.hoursRangeStart).minutes(0).format('HH:mm')) }, 30)
    } else if (this.calendarComponent.getApi().view.type == "dayGridMonth") {
      dayGridMonthButton.setAttribute(
        "style",
        "background-color:#881324 !important;"
      );
      timeGridWeekButton.removeAttribute("style");
      workWeekButton.removeAttribute("style");
    } else if (this.calendarComponent.getApi().view.type == "workDaysView") {
      workWeekButton.setAttribute(
        "style",
        "background-color:#881324 !important;"
      );
      timeGridWeekButton.removeAttribute("style");
      dayGridMonthButton.removeAttribute("style");
    }
  }

  handleCalendarDatesSet(arg) {
    this.startDateCalendar = moment(arg.start).format("YYYY-MM-DD");
    this.endDateCalendar = moment(arg.end).format("YYYY-MM-DD");
    this.getCalendarData();
    this.fixCalendarUI();
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
      width: "400px",
      autoFocus: false,
      maxHeight: "90vh",
      panelClass: [`dialog-custom`],
    });
    dialogRef.componentInstance.elements = elements;
    dialogRef.componentInstance.elementsType = elementsType;
  }

  // openDialogAjouterEvenement(date): void {
  //   const dialogRef = this.dialog.open(AjouterEvenementComponent, {
  //     width: "480px",
  //     autoFocus: false,
  //     panelClass: [`dialog-custom`],
  //   });
  //   dialogRef.componentInstance.userItem = this.userItem;
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.getCalendarPersoData(
  //         this.startDateCalendar,
  //         this.endDateCalendar,
  //         this.calendarComponent.getApi().view.type
  //       );
  //     }
  //   });
  //   dialogRef.componentInstance.clickedDate = date;
  //   dialogRef.componentInstance.id_utilisateur =
  //     this.typeAgenda == "Un délégué de mon équipe"
  //       ? this.form.controls["id_utilisateur"].value
  //       : null;
  // }

  openDialogActions(clickedDate, viewType, isLimited = false): void {
    const dialogRef = this.dialog.open(ActionsDialogComponent, {
      width: "800px",
      autoFocus: false,
      panelClass: [`dialog-custom`],
    });
    dialogRef.componentInstance.userItem = this.userItem;
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
    dialogRef.componentInstance.clickedDate = clickedDate;
    dialogRef.componentInstance.viewType = viewType;
    dialogRef.componentInstance.startDateCalendar = this.startDateCalendar;
    dialogRef.componentInstance.endDateCalendar = this.endDateCalendar;
    dialogRef.componentInstance.calendar = this;
    dialogRef.componentInstance.nbrJoursPass = this.nbrJoursPass;
    dialogRef.componentInstance.isLimited = isLimited;
  }

  openDialogButtonHandler() {
    // if (this.typeAgenda == "Un délégué de mon équipe") {
    //   this.openDialogAjouterEvenement(undefined);
    // } else {
    //   this.openDialogActions(undefined, undefined);
    // }
    if (this.typeAgenda == "Un délégué de mon équipe") {
      // if(this.userItem.role != 'ADMI'){
      // this.openDialogAjouterEvenement(undefined);
      this.openDialogActions(undefined, undefined, true);
      // }
    } else {
      if (this.userItem.role == 'ADMI') {
        // this.openDialogAjouterEvenement(undefined);
        this.openDialogActions(undefined, undefined, true);
      }
      else {
        this.openDialogActions(undefined, undefined);
      }
    }
  }

  openDialogFicheEvenementAgenda(id_evenement, clickedDate): void {
    const dialogRef = this.dialog.open(FicheEvenementAgendaComponent, {
      width: "500px",
      autoFocus: false,
      maxHeight: "90vh",
      panelClass: [`dialog-custom`],
    });
    dialogRef.componentInstance.id_evenement = id_evenement;
    dialogRef.componentInstance.calendar = this;
    dialogRef.componentInstance.clickedDate = clickedDate;
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
        this.getCalendarPersoData(
          this.startDateCalendar,
          this.endDateCalendar,
          this.calendarComponent.getApi().view.type
        );
      }
    });
    dialogRef.componentInstance.clickedCalendarDate = undefined;
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
        this.getCalendarPersoData(
          this.startDateCalendar,
          this.endDateCalendar,
          this.calendarComponent.getApi().view.type
        );
      }
    });
    dialogRef.componentInstance.clickedDate = undefined;
    dialogRef.componentInstance.id_utilisateur =
      this.typeAgenda == "Un délégué de mon équipe"
        ? this.form.controls.id_utilisateur.value
        : null;
    dialogRef.componentInstance.typeEvenement = type;
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
