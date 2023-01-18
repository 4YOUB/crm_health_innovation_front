import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTitleService } from 'app/core/page-title/page-title.service';
import { CurrentUserService } from 'app/service/current-user.service';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import { PlanificationService } from 'app/service/planification-service/planification.service';
import * as moment from 'moment';
import { AjouterRapportComponent } from '../ajouter-rapport/ajouter-rapport.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AjouterVisiteComponent } from 'app/visite/ajouter-visite/ajouter-visite.component';
import Swal from 'sweetalert2';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Objets par page';

  return customPaginatorIntl;
}
@Component({
  selector: 'ms-liste-rapport',
  templateUrl: './liste-rapport.component.html',
  styleUrls: ['./liste-rapport.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ListeRapportComponent implements OnInit {
  userItem
  isLoading
  totalRapports
  listeRapports = []
  listeJoursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  listeDatesSemaine = []
  isSubmitted: boolean = false;
  form: FormGroup;
  idPlanification
  date_debut
  date_fin
  pageSize = 10
  pageIndex = 0
  num_semaine: any
  date_jour = moment(new Date()).format('YYYY-MM-DD')
  maxDate = moment(new Date()).format('YYYY-MM-DD');
  minDate = moment(new Date()).format('YYYY-MM-DD');
  // nbrJoursFutur = 0;
  nbrJoursPass = 0;
  isExporting = false;

  constructor(
    private planificationService: PlanificationService,
    private formBuilder: FormBuilder,
    private pageTitleService: PageTitleService,
    private _currentUser: CurrentUserService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public router: Router,
    private listeCodifService: ListeCodifService,
  ) {
    this.userItem = this._currentUser.getRoleCurrentUser();
    this.idPlanification = this.route.snapshot.paramMap.get('id_planification');

  }

  ngOnInit(): void {
    setTimeout(() => {
      this.pageTitleService.setTitle("Rapports Planification");
    }, 0);
    this.initForm()
    this.getInfos()
    this.get_nbr_jours();
    this.getRapports(this.pageSize, this.pageIndex);
  }

  openDialogAjouterRapport(item): void {
    const dialogRef = this.dialog.open(AjouterRapportComponent, {
      width: '800px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.userItem = this.userItem;
    dialogRef.componentInstance.itemRapport = item;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.reset()
        this.getRapports(this.pageSize, this.pageIndex);
        // ok Valider
      }
    })
  }

  get_nbr_jours() {
    this.listeCodifService.get_nbr_jours()
      .subscribe((res: any) => {
        // this.nbrJoursFutur = res["JRFUTUR"].libelle_codification;
        this.nbrJoursPass = res["JRPASS"].libelle_codification;
        this.minDate = moment(new Date()).subtract(this.nbrJoursPass, "days").format('YYYY-MM-DD');
      });
  }
  getInfos() {
    this._currentUser.getInfos()
      .subscribe((res: any) => {
        this.date_jour = moment(res.date_jour).format('YYYY-MM-DD');
        this.maxDate = this.date_jour;
        this.minDate = this.date_jour;
      }, err => {
      })
  }

  isDateVisiteOutRange(dateVisite) {
    return new Date(dateVisite) < new Date(this.minDate + " " + "00:00") || new Date(dateVisite) > new Date(this.maxDate + " " + "23:59");
  }


  initForm() {
    this.form = this.formBuilder.group({
      date_jour: [null]
    });
  }

  reset() {
    this.form.reset();
    this.isSubmitted = false;
    this.pageIndex = 0
    this.getRapports(this.pageSize, this.pageIndex);
  }

  filtrer() {
    this.isSubmitted = true;
    setTimeout(() => {
      if (this.isSubmitted == true && this.form.valid) {
        this.pageIndex = 0
        this.getRapports(this.pageSize, this.pageIndex)
      }
    }, 100);
  }

  getListeDatesSemaine(date_debut, date_fin) {
    this.listeDatesSemaine = []
    for (
      var date = moment(date_debut);
      date.diff(date_fin, 'days') <= 0;
      date.add(1, 'days')
    ) {
      this.listeDatesSemaine.push(date.format('YYYY-MM-DD'));
    }
  }

  type_tri
  order_by
  optionTri(event) {
    this.type_tri = event?.type_tri
    this.order_by = event?.order_by
    this.getRapports(this.pageSize, this.pageIndex)
  }

  getRapports(records_per_page, page_number) {
    this.isLoading = true;
    this.listeRapports = []

    const body = {
      id_planification: this.idPlanification,
      date_jour: this.form.controls['date_jour'].value,
      order_by: this.order_by,
      type_tri: this.type_tri
    };

    this.planificationService.getRapports(records_per_page, page_number, body)
      .subscribe((res: any) => {
        if (res.flag_disponible == 'N') {
          Swal.fire({
            icon: 'error',
            title: `Une erreur est survenue`,
            text: 'La page recherchée est introuvable',
            showConfirmButton: false,
            heightAuto: false,
            timer: 2500
          });
          this.router.navigate(['/planifications/liste']);
        }
        this.listeRapports = res.rapports;
        this.totalRapports = res.nbr_total_rapports;
        this.date_debut = res.date_deb_planification;
        this.date_fin = res.date_fin_planification;
        this.num_semaine = res.num_semaine;
        this.getListeDatesSemaine(this.date_debut, this.date_fin)
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
      })
  }

  openDialogModifierVisite(mode?, idVisite?, idPartenaire?, idPlanification?): void {
    const dialogRef = this.dialog.open(AjouterVisiteComponent, {
      width: '900px',
      autoFocus: false,
      maxHeight: '90vh',
      maxWidth: '80vw',
    });
    dialogRef.componentInstance.id_visite = idVisite;
    dialogRef.componentInstance.idPartenaire = idPartenaire;
    dialogRef.componentInstance.id_planification = idPlanification;
    dialogRef.componentInstance.mode = mode;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.reset()
        this.getRapports(this.pageSize, this.pageIndex);
        // ok Valider
      }
    })
  }

  getNextPage(event) {
    this.pageSize = event.pageSize
    this.pageIndex = event.pageIndex
    this.getRapports(event.pageSize, event.pageIndex)
  }

  exportRapports() {
    this.isExporting = true;
    const body = {
      id_planification: this.idPlanification,
      date_jour: this.form.controls['date_jour'].value,
      order_by: this.order_by,
      type_tri: this.type_tri
    }
    this.planificationService.exportRapports(body)
      .subscribe((res: any) => {

        const filename = `Rapports_Planification_${moment(new Date()).format("YYYY-MM-DD_HH-mm")}.xlsx`;
        let dataType = res.type;
        let binaryData = [];
        binaryData.push(res);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        if (filename) downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();

        this.isExporting = false;

      }, err => {
        this.isExporting = false;
        if (err.status == 403) {
          Swal.fire({
            icon: "warning",
            text: `Désolé, Vous n'êtes pas autorisé à faire cette opération !`,
            showConfirmButton: false,
            heightAuto: false,
            timer: 2500,
          });
        }
        else {
          this.showMessageError();
        }
      })


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

}
