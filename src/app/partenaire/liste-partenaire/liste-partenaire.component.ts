import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { AjouterBusinessCaseComponent } from 'app/business-case/ajouter-business-case/ajouter-business-case.component';
import { PageTitleService } from 'app/core/page-title/page-title.service';
import { CurrentUserService } from 'app/service/current-user.service';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import { PartenaireService } from 'app/service/partenaire-service/partenaire.service';
import { AjouterVisiteComponent } from 'app/visite/ajouter-visite/ajouter-visite.component';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { AjouterPartenaireComponent } from '../ajouter-partenaire/ajouter-partenaire.component';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Objets par page';

  return customPaginatorIntl;
}
@Component({
  selector: 'ms-liste-partenaire',
  templateUrl: './liste-partenaire.component.html',
  styleUrls: ['./liste-partenaire.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ListePartenaireComponent implements OnInit {
  isLoading
  totalPartenaires
  listePartenaires = []
  listeEtablissements = []
  listeSpecialites = []
  listeRevis = []
  listeVilles = []
  listeSecteurs = []
  form: FormGroup;
  userItem
  pageSize = 10
  pageIndex = 0
  isExporting = false

  constructor(private partenaireService: PartenaireService,
    private formBuilder: FormBuilder,
    private pageTitleService: PageTitleService,
    private _currentUser: CurrentUserService,
    public dialog: MatDialog,
    private listeCodifService: ListeCodifService) {

      this.userItem = this._currentUser.getRoleCurrentUser();

    }

  ngOnInit(): void {
    setTimeout(()=>{
			this.pageTitleService.setTitle("Liste Comptes");
		},0);
    this.initForm()
    this.getPartenaire(this.pageSize, this.pageIndex)
    this.getEtablissements()
    this.getSpecialites()
    this.getRevis()

  }

  openDialogAjouterPartenaire(): void {
    this.userItem = this._currentUser.getRoleCurrentUser();
		const dialogRef = this.dialog.open(AjouterPartenaireComponent, {
			width: '800px',
			autoFocus: false,
      maxHeight: '90vh'
		});
    dialogRef.componentInstance.userItem = this.userItem;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reset()
        // ok Valider
      }
    })
	}

  openDialogAjouterVisite(idPartenaire): void {
		const dialogRef = this.dialog.open(AjouterVisiteComponent, {
      width: '900px',
      autoFocus: false,
      maxHeight: '90vh',
      maxWidth: '80vw',
		});
    dialogRef.componentInstance.idPartenaire = idPartenaire;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reset()
        // ok Valider
      }
    })
	}

  initForm() {
    this.form = this.formBuilder.group({
      id_partenaire: [null],
      type_partenaire: [{
        value: this.userItem.flag_medical == 'O' && this.userItem.flag_pharmaceutique == 'N' ? 'MEDE' : this.userItem.flag_medical == 'N' && this.userItem.flag_pharmaceutique == 'O' ? 'PHAR' : null,
        disabled: this.userItem.flag_medical != this.userItem.flag_pharmaceutique ? true : false
      }],
      nom_partenaire: [null],
      code_type_etablissement: [null],
      potentiel: [null],
      code_specialite: [null],
      code_region: [null],
      code_ville: [{ value: null, disabled: true }],
      code_secteur: [{ value: null, disabled: true }],
      statut: [null]
    });
    this.onChangeTypePartenaire()
  }

  reset() {
    this.initForm();
    this.onChangeTypePartenaire()
    this.selectVille({})
    this.pageIndex = 0
    this.getPartenaire(this.pageSize, this.pageIndex)
  }

  filtrer() {
    this.pageIndex = 0
    this.getPartenaire(this.pageSize, this.pageIndex)
  }
    
  type_tri
  order_by
  optionTri(event){
    this.type_tri = event?.type_tri
    this.order_by = event?.order_by
    this.getPartenaire(this.pageSize, this.pageIndex)
  }

  getPartenaire(records_per_page, page_number) {
    this.isLoading = true;
    this.listePartenaires = []

    // const body = this.form.value;
    const body = {
      id_partenaire: this.form.controls['id_partenaire'].value,
      type_partenaire: this.form.controls['type_partenaire'].value,
      nom_partenaire: this.form.controls['nom_partenaire'].value,
      code_type_etablissement: this.form.controls['code_type_etablissement'].value,
      potentiel: this.form.controls['potentiel'].value?.length ? this.form.controls['potentiel'].value : null ,
      code_specialite: this.form.controls['code_specialite'].value?.length ? this.form.controls['code_specialite'].value : null ,
      code_region: this.form.controls['code_region'].value,
      code_ville: this.form.controls['code_ville'].value,
      code_secteur: this.form.controls['code_secteur'].value,
      code_statut_partenaire: this.form.controls['statut'].value,
      order_by: this.order_by,
      type_tri: this.type_tri 
    }
    this.partenaireService.getPartenaire(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listePartenaires = res.partenaires;
        this.totalPartenaires = res.nbr_total_partenaires;
        this.isLoading = false;
      }, err => {
        // this.showMessageError();
        this.isLoading = false;
      })

  }

  getEtablissements() {
    this.listeCodifService.getEtablissement()
      .subscribe((res: any) => {
        this.listeEtablissements = res.etablissements;
      }, err => {
        // this.showMessageError();
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

  getRevis() {
    this.listeCodifService.getRevis()
      .subscribe((res: any) => {
        this.listeRevis = res.regions;
      }, err => {
        // this.showMessageError();
      })
  }

  onChangeTypePartenaire() {
    if (this.form.controls['type_partenaire'].value == 'PHAR') {
      this.form.get('code_type_etablissement').setValue(null);
      this.form.get('code_type_etablissement').disable();
      this.form.get('code_specialite').setValue(null);
      this.form.get('code_specialite').disable();
    }
    else {
      this.form.get('code_specialite').enable();
      this.form.get('code_type_etablissement').enable()
    }
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

  openDialogAjouterBusinessCase(idPartenaire): void {
    const dialogRef = this.dialog.open(AjouterBusinessCaseComponent, {
      width: '800px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.userItem = this.userItem;
    dialogRef.componentInstance.id_partenaire = idPartenaire;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reset()
      }
    })
  }
  
  getNextPage(event) {
    this.pageSize = event.pageSize
    this.pageIndex = event.pageIndex
    this.getPartenaire(event.pageSize, event.pageIndex)
  }

  exportPartenaires(){
    this.isExporting = true;
    const body = {
      id_partenaire: this.form.controls['id_partenaire'].value,
      type_partenaire: this.form.controls['type_partenaire'].value,
      nom_partenaire: this.form.controls['nom_partenaire'].value,
      code_type_etablissement: this.form.controls['code_type_etablissement'].value,
      potentiel: this.form.controls['potentiel'].value?.length ? this.form.controls['potentiel'].value : null ,
      code_specialite: this.form.controls['code_specialite'].value?.length ? this.form.controls['code_specialite'].value : null ,
      code_region: this.form.controls['code_region'].value,
      code_ville: this.form.controls['code_ville'].value,
      code_secteur: this.form.controls['code_secteur'].value,
      code_statut_partenaire: this.form.controls['statut'].value,
      order_by: this.order_by,
      type_tri: this.type_tri 
    }
    this.partenaireService.exportPartenaires(body)
      .subscribe((res: any) => {

        const filename = `Comptes_${moment(new Date()).format("YYYY-MM-DD_HH-mm")}.xlsx`;
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
