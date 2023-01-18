import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import { ParamsAppService } from 'app/service/params-app-service/params-app.service';
import { PlanificationService } from 'app/service/planification-service/planification.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'ms-ajouter-planification',
  templateUrl: './ajouter-planification.component.html',
  styleUrls: ['./ajouter-planification.component.scss']
})
export class AjouterPlanificationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AjouterPlanificationComponent>
    , private listeCodifService: ListeCodifService,
    private formBuilder: FormBuilder,
    public paramsAppService: ParamsAppService,
    private planificationService: PlanificationService) { }
  @ViewChild(CdkVirtualScrollViewport)
  cdkVirtualScrollViewPort: CdkVirtualScrollViewport;
  title = "Ajouter Planification"
  clickedDate
  isLoading = true
  listePartenaires = []
  filterelistePartenaires = []
  form: FormGroup;
  today = moment().format('YYYY-MM-DD')
  isSubmitted
  heurePlanification
  listHours = []
  hoursRangeStart
  hoursRangeEnd
  minTime
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id_partenaire: [null],
      date_visite: [this.clickedDate.date || null],
      heure_fin_visite: [null]
    })
    this.getPartenaire();
    this.get_app_params()
    this.heurePlanification = this.clickedDate.time
    const remainder = 30 - (moment().minute() % 30)
    this.minTime = moment().add(remainder, 'm')
    this.isLoading = false

  }
  showMessageSuccess(msg) {
    Swal.fire({
      icon: 'success',
      text: msg,
      showConfirmButton: false,
      heightAuto: false,
      timer: 2500
    });
  }
  showMessageWarning(msg) {
    Swal.fire({
      icon: 'warning',
      text: msg,
      showConfirmButton: false,
      heightAuto: false,
      timer: 3500
    });
  }
  showMessageError() {
    Swal.fire({
      icon: 'error',
      title: `Une erreur est survenue`,
      text: 'Veuillez réessayer plus tard',
      showConfirmButton: false,
      heightAuto: false,
      timer: 2500
    });
  }
  save() {
    this.isSubmitted = true
    const body = {
      id_partenaire: this.form.get('id_partenaire').value,
      date_visite: this.form.get('date_visite').value + ' ' + this.heurePlanification + ':00',
      heure_fin_visite: moment(this.heurePlanification, 'HH:mm').add(30, 'm').seconds(0).format('HH:mm:ss')
    }
    if (body.id_partenaire && this.heurePlanification) {
      this.planificationService.ajouterPartenairePlanifiee(body).subscribe(
        (res: any) => {
          if (res?.duplicate) {
            this.showMessageWarning("La planification existe déjà pour cette date")
            return
          }
          this.showMessageSuccess("le rendez-vous a été ajouté avec succès")
          this.dialogRef.close()
        },
        (err) => {
          if (err.status == 409) {
            Swal.fire({
              icon: "warning",
              // text: `L'heure choisie (${item.heure_visite}) est occupé par une autre planification !`,
              text: `La période choisie est occupé. Consultez votre agenda pour vérifier`,
              showConfirmButton: false,
              heightAuto: false,
              timer: 2500,
            });
          }
          else {
            this.showMessageError();
          }
        }
      );
    }
  }
  getPartenaire() {
    this.planificationService.getPlanificationPartenaire(99999999, 0, {
      date_planification: this.form.get('date_visite').value
    }).subscribe(res => {
      this.listePartenaires = this.filterelistePartenaires = res.partenaires;
    })
  }
  initHours() {
    this.getPartenaire()
    this.listHours = []
    for (let i = this.hoursRangeStart; i <= this.hoursRangeEnd; i++) {
      let timeToAdd = moment().hours(i).minutes(0).seconds(0)
      if (moment(this.form.get('date_visite').value, 'YYYY-MM-DD').isAfter(moment()) ||
        moment(timeToAdd.format('HH:mm'), 'HH:mm').isAfter(moment(this.minTime.format('HH:mm'), 'HH:mm')))
        this.listHours.push(timeToAdd.format('HH:mm'))

      timeToAdd = moment(timeToAdd, 'HH:mm').add(30, 'm')
      if (moment(this.form.get('date_visite').value, 'YYYY-MM-DD').isAfter(moment()) ||
        moment(timeToAdd.format('HH:mm'), 'HH:mm').isSameOrAfter(moment(this.minTime.format('HH:mm'), 'HH:mm')))
        this.listHours.push(timeToAdd.format('HH:mm'))
    }
  }
  openChange($event: boolean, index?, id_partenaire?) {
    if ($event) {
      this.cdkVirtualScrollViewPort.scrollToIndex(0);
      this.cdkVirtualScrollViewPort.checkViewportSize();
    }
  }
  filterPartenaires(value, index?) {
    this.filterelistePartenaires = this.listePartenaires
    this.filterelistePartenaires = this.filterelistePartenaires.
      filter(partenaire => partenaire.nom_partenaire.toUpperCase().includes(value.toUpperCase()))

  }
  get_app_params() {
    this.paramsAppService.get().then((params: any) => {

      this.hoursRangeStart = Number(params["HEVI"]["HRSTART"]);
      this.hoursRangeEnd = Number(params["HEVI"]["HREND"]);
      this.initHours();

    });
  }
}
