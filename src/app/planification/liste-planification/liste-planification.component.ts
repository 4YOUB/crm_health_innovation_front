import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageTitleService } from 'app/core/page-title/page-title.service';
import { CurrentUserService } from 'app/service/current-user.service';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import { PlanificationService } from 'app/service/planification-service/planification.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Objets par page';

  return customPaginatorIntl;
}
@Component({
  selector: 'ms-liste-planification',
  templateUrl: './liste-planification.component.html',
  styleUrls: ['./liste-planification.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ListePlanificationComponent implements OnInit {
  isLoading
  totalPlanification
  listePlanification = []
  listeSemaines = []
  listeUtilisateurs = []
  listeVilles = []
  idUtilisateur
  form: FormGroup;
  userItem
  pageSize = 10
  pageIndex = 0
  date_jour = new Date();
  isExporting = false;

  constructor(
    private formBuilder: FormBuilder,
    private pageTitleService: PageTitleService,
    private _currentUser: CurrentUserService,
    private listeCodifService: ListeCodifService,
    private planificationService: PlanificationService,
    private route: ActivatedRoute) {
    this.userItem = this._currentUser.getRoleCurrentUser();
    this.idUtilisateur = this.route.snapshot.paramMap.get('id_utilisateur') ? parseFloat(this.route.snapshot.paramMap.get('id_utilisateur')) : null;

  }

  ngOnInit(): void {
    setTimeout(() => {
			this.pageTitleService.setTitle("Liste Planifications");
    }, 0);
    this.initForm()
    this.getListePlanification(this.pageSize, this.pageIndex)
    this.getListeSemaines()
    this.getUtilisateurs()
    this.getInfos()
  }

  getInfos() {
    this._currentUser.getInfos()
      .subscribe((res: any) => {
        this.date_jour = res.date_jour;
      }, err => {

      })
  }


  initForm() {
    this.form = this.formBuilder.group({
      liste_semaines: [null],
      id_utilisateur: [this.idUtilisateur],
    });

  }

  reset() {
    this.form.reset();
    this.pageIndex = 0
    this.getListePlanification(this.pageSize, this.pageIndex)
  }

  filtrer() {
    this.pageIndex = 0
    this.getListePlanification(this.pageSize, this.pageIndex)
  }
    
  type_tri
  order_by
  optionTri(event){
    this.type_tri = event?.type_tri
    this.order_by = event?.order_by
    this.getListePlanification(this.pageSize, this.pageIndex)
  }

  getListePlanification(records_per_page, page_number) {
    this.isLoading = true;
    this.listePlanification = []

    const body = {
      date_deb_semaine: this.form.controls['liste_semaines'].value ? this.form.controls['liste_semaines'].value?.date_debut : null,
      date_fin_semaine: this.form.controls['liste_semaines'].value ? this.form.controls['liste_semaines'].value?.date_fin : null,
      id_utilisateur: this.form.controls['id_utilisateur'].value,
      order_by: this.order_by,
      type_tri: this.type_tri 
    };

    this.planificationService.getListePlanification(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listePlanification = res.planifications;
        this.totalPlanification = res.nbr_total_planifications;
        this.isLoading = false;
      }, err => {
        // this.showMessageError();
        this.isLoading = false;
      })

  }

  getListeSemaines() {
    this.listeCodifService.getListeSemaines()
      .subscribe((res: any) => {
        this.listeSemaines = res.liste_semaines;
      }, err => {
        // this.showMessageError();
      })
  }

  getUtilisateurs() {
    this.listeCodifService.getUtilisateurs('plan')
      .subscribe((res: any) => {
        const utilisateurs = res.utilisateurs.map(item => {
          return {
            role: item.role,
            code_codification: item.id_utilisateur,
            libelle_codification: item.nom_utilisateur,
          }
        });
        this.listeUtilisateurs = utilisateurs;
      }, err => {
        // this.showMessageError();
      })
  }

  getNextPage(event) {
    this.pageSize = event.pageSize
    this.pageIndex = event.pageIndex
    this.getListePlanification(event.pageSize, event.pageIndex)
  }

  exportPlanifications(){
    this.isExporting = true;
    const body = {
      date_deb_semaine: this.form.controls['liste_semaines'].value ? this.form.controls['liste_semaines'].value?.date_debut : null,
      date_fin_semaine: this.form.controls['liste_semaines'].value ? this.form.controls['liste_semaines'].value?.date_fin : null,
      id_utilisateur: this.form.controls['id_utilisateur'].value,
      order_by: this.order_by,
      type_tri: this.type_tri 
    }
    this.planificationService.exportPlanifications(body)
      .subscribe((res: any) => {

        const filename = `Planifications_${moment(new Date()).format("YYYY-MM-DD_HH-mm")}.xlsx`;
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
        if(err.status == 403){
          Swal.fire({
            icon: "warning",
            text: `Désolé, Vous n'êtes pas autorisé à faire cette opération !`,
            showConfirmButton: false,
            heightAuto: false,
            timer: 2500,
          });
        }
        else{
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
