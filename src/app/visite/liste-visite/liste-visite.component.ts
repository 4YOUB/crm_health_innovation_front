import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageTitleService } from 'app/core/page-title/page-title.service';
import { CurrentUserService } from 'app/service/current-user.service';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import { VisiteService } from 'app/service/visite-service/visite.service';
import * as moment from "moment";
import { AjouterVisiteComponent } from '../ajouter-visite/ajouter-visite.component';
import { FicheVisiteComponent } from '../fiche-visite/fiche-visite.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FicheVisiteAgendaComponent } from 'app/agenda/fiche-visite-agenda/fiche-visite-agenda.component';
import { PartenairesModalComponent } from '../partenaires-modal/partenaires-modal.component';
import { ParamsAppService } from 'app/service/params-app-service/params-app.service';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Objets par page';

  return customPaginatorIntl;
}
@Component({
  selector: 'ms-liste-visite',
  templateUrl: './liste-visite.component.html',
  styleUrls: ['./liste-visite.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ListeVisiteComponent implements OnInit {

  isLoading
  totalVisites
  listeVisites = []
  listeSpecialites = []
  listeUtilisateurs = []
  listeRevis = []
  listeVilles = []
  listeSecteurs = []
  idUtilisateur
  form: FormGroup;
  userItem
  pageSize = 10
  pageIndex = 0
  date_jour = moment(new Date()).format('YYYY-MM-DD')
  maxDate = moment(new Date()).format('YYYY-MM-DD');
  minDate = moment(new Date()).format('YYYY-MM-DD');
  // nbrJoursFutur = 0;
  nbrJoursPass = 0;
  isExporting = false;
  exportLimit
  constructor(
    private visiteService: VisiteService,
    private formBuilder: FormBuilder,
    private pageTitleService: PageTitleService,
    private _currentUser: CurrentUserService,
    public dialog: MatDialog,
    private listeCodifService: ListeCodifService,
    private route: ActivatedRoute,
    private paramsAppService: ParamsAppService) {
    this.userItem = this._currentUser.getRoleCurrentUser();
    this.idUtilisateur = this.route.snapshot.paramMap.get('id_utilisateur') ? parseFloat(this.route.snapshot.paramMap.get('id_utilisateur')) : null;

  }

  ngOnInit(): void {
    this.getInfos()
    this.get_nbr_jours();
    setTimeout(() => {
      this.pageTitleService.setTitle("Liste Visites");
    }, 0);
    this.initForm()
    this.getVisite(this.pageSize, this.pageIndex)
    this.getSpecialites()
    this.getUtilisateurs()
    this.getRevis()
    this.paramsAppService.get().then(params => this.exportLimit = params['LIMEXPORT']['LIMIT'])
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

  openDialogAjouterVisite(): void {
    const dialogRef = this.dialog.open(AjouterVisiteComponent, {
      width: '900px',
      autoFocus: false,
      maxHeight: '90vh',
      maxWidth: '80vw',
    });
    dialogRef.componentInstance.userItem = this.userItem;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reset()
        // ok Valider
      }
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
        this.getVisite(this.pageSize, this.pageIndex)
        // ok Valider
      }
    })
  }


  openDialogFicheVisite(id_visite): void {
    const dialogRef = this.dialog.open(FicheVisiteAgendaComponent, {
      width: '900px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.userItem = this.userItem;
    dialogRef.componentInstance.id_visite = id_visite;
  }

  initForm() {
    this.form = this.formBuilder.group({
      type_partenaire: [{
        value: this.userItem.flag_medical == 'O' && this.userItem.flag_pharmaceutique == 'N' ? 'MEDE' : this.userItem.flag_medical == 'N' && this.userItem.flag_pharmaceutique == 'O' ? 'PHAR' : null,
        disabled: this.userItem.flag_medical != this.userItem.flag_pharmaceutique ? true : false
      }],
      nom_partenaire: [null],
      code_potentiel: [null],
      code_specialite: [null],
      code_statut_visite: [null],
      date_debut_visite: [null],
      date_fin_visite: [null],
      id_utilisateur: [this.idUtilisateur],
      code_region: [null],
      code_ville: [{ value: null, disabled: true }],
      code_secteur: [{ value: null, disabled: true }],
    });
    this.onChangeTypePartenaire()
  }

  reset() {
    this.initForm();
    this.onChangeTypePartenaire()
    this.pageIndex = 0
    this.getVisite(this.pageSize, this.pageIndex)
    this.selectVille({})
  }

  filtrer() {
    this.pageIndex = 0
    this.getVisite(this.pageSize, this.pageIndex)
  }

  type_tri
  order_by
  optionTri(event) {
    this.type_tri = event?.type_tri
    this.order_by = event?.order_by
    this.getVisite(this.pageSize, this.pageIndex)
  }

  getVisite(records_per_page, page_number) {
    this.isLoading = true;
    this.listeVisites = []

    const body = {
      type_partenaire: this.form.controls['type_partenaire'].value,
      nom_partenaire: this.form.controls['nom_partenaire'].value,
      code_potentiel: this.form.controls['code_potentiel'].value?.length ? this.form.controls['code_potentiel'].value : null,
      code_specialite: this.form.controls['code_specialite'].value?.length ? this.form.controls['code_specialite'].value : null,
      code_statut_visite: this.form.controls['code_statut_visite'].value,
      date_debut_visite: this.form.controls['date_debut_visite'].value ?
        moment(this.form.controls['date_debut_visite'].value).add(1, 'h').format('YYYY-MM-DD') : null,
      date_fin_visite: this.form.controls['date_fin_visite'].value ?
        moment(this.form.controls['date_fin_visite'].value).add(1, 'h').format('YYYY-MM-DD') : null,
      id_utilisateur: this.form.controls['id_utilisateur'].value,
      code_region: this.form.controls['code_region'].value,
      code_ville: this.form.controls['code_ville'].value,
      code_secteur: this.form.controls['code_secteur'].value,
      order_by: this.order_by,
      type_tri: this.type_tri
    };

    if (body.date_debut_visite) body.date_debut_visite = body.date_debut_visite + " 00:00";
    if (body.date_fin_visite) body.date_fin_visite = body.date_fin_visite + " 23:59";

    this.visiteService.getVisite(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listeVisites = res.visites;
        this.totalVisites = res.nbr_total_visites;
        this.isLoading = false;
      }, err => {
        // this.showMessageError();
        this.isLoading = false;
      })

  }

  getSpecialites() {
    this.listeCodifService.getSpecialites()
      .subscribe((res: any) => {
        this.listeSpecialites = res.specialites;
      }, err => {
        // this.showMessageError();
      })
  }

  getUtilisateurs() {
    this.listeCodifService.getUtilisateurs()
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

  openPartenairesModal(id_visite) {
    const dialogRef = this.dialog.open(PartenairesModalComponent, {
      width: '600px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.id_visite = id_visite
  }

  onChangeTypePartenaire() {
    if (this.form.controls['type_partenaire'].value == 'PHAR') {
      this.form.get('code_specialite').setValue(null);
      this.form.get('code_specialite').disable();
    }
    else {
      this.form.get('code_specialite').enable();
    }
  }

  getRevis() {
    this.listeCodifService.getRevis()
      .subscribe((res: any) => {
        this.listeRevis = res.regions;
      }, err => {
        // this.showMessageError();
      })
  }

  selectVille(item) {
    this.listeVilles = item.villes ? item.villes : []
    this.listeSecteurs = []
    this.form.get('code_ville').setValue(null);
    this.form.get('code_secteur').setValue(null);

    if (this.listeVilles?.length == 0 || !this.listeVilles) {
      this.form.get('code_ville').disable();
      this.form.get('code_secteur').disable();
    }
    else {
      this.form.get('code_ville').enable();
      this.form.get('code_secteur').enable();
    }
  }

  selectSecteur(item) {
    this.listeSecteurs = item.secteurs ? item.secteurs : []
    this.form.get('code_secteur').setValue(null);

    if (this.listeSecteurs?.length == 0 || !this.listeSecteurs) {
      this.form.get('code_secteur').disable();
    }
    else {
      this.form.get('code_secteur').enable();
    }
  }

  getNextPage(event) {
    this.pageSize = event.pageSize
    this.pageIndex = event.pageIndex
    this.getVisite(event.pageSize, event.pageIndex)
  }

  exportVisites() {
    this.isExporting = true;
    if (!this.totalVisites || this.totalVisites > this.exportLimit) {
      this.isExporting = false
      Swal.fire({
        icon: "warning",
        text: `Désolé, vous devez ajouter plus de filtres pour réduire le nombre d'enregistrements d'export (${this.totalVisites} enregistrements alors que le maximum des enregistrements autorisés en export est de ${this.exportLimit})`,
        showConfirmButton: true,
        heightAuto: false,
        timer: 10000,
      });
      return
    }
    const body = {
      type_partenaire: this.form.controls['type_partenaire'].value,
      nom_partenaire: this.form.controls['nom_partenaire'].value,
      code_potentiel: this.form.controls['code_potentiel'].value?.length ? this.form.controls['code_potentiel'].value : null,
      code_specialite: this.form.controls['code_specialite'].value?.length ? this.form.controls['code_specialite'].value : null,
      code_statut_visite: this.form.controls['code_statut_visite'].value,
      date_debut_visite: this.form.controls['date_debut_visite'].value ?
        moment(this.form.controls['date_debut_visite'].value).add(1, 'h').format('YYYY-MM-DD') : null,
      date_fin_visite: this.form.controls['date_fin_visite'].value ?
        moment(this.form.controls['date_fin_visite'].value).add(1, 'h').format('YYYY-MM-DD') : null,
      id_utilisateur: this.form.controls['id_utilisateur'].value,
      code_region: this.form.controls['code_region'].value,
      code_ville: this.form.controls['code_ville'].value,
      code_secteur: this.form.controls['code_secteur'].value,
      order_by: this.order_by,
      type_tri: this.type_tri
    }
    if (body.date_debut_visite) body.date_debut_visite = body.date_debut_visite + " 00:00";
    if (body.date_fin_visite) body.date_fin_visite = body.date_fin_visite + " 23:59";
    this.visiteService.exportVisites(body)
      .subscribe((res: any) => {

        const filename = `Visites_${moment(new Date()).format("YYYY-MM-DD_HH-mm")}.xlsx`;
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
