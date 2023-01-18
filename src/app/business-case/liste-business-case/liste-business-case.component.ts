import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageTitleService } from 'app/core/page-title/page-title.service';
import { CurrentUserService } from 'app/service/current-user.service';
import { BusinessCaseService } from 'app/service/business-case-service/business-case.service';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import { MatDialog } from '@angular/material/dialog';
import { AjouterBusinessCaseComponent } from '../ajouter-business-case/ajouter-business-case.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FicheBusinessCaseComponent } from '../fiche-business-case/fiche-business-case.component';
import * as moment from 'moment';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Objets par page';

  return customPaginatorIntl;
}
@Component({
  selector: 'ms-liste-business-case',
  templateUrl: './liste-business-case.component.html',
  styleUrls: ['./liste-business-case.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ListeBusinessCaseComponent implements OnInit {

  userItem;
  totalBC;
  listeBC = []
  form: FormGroup;
  listeSpecialites = []
  listeUtilisateurs = []
  isLoading;
  listeRevis = []
  listeVilles = []
  listeSecteurs = []
  idUtilisateur
  pageSize = 10
  pageIndex = 0
  isExporting = false;
  constructor(
    private formBuilder: FormBuilder,
    private pageTitleService: PageTitleService,
    private _currentUser: CurrentUserService,
    private businessCaseService: BusinessCaseService,
    private listeCodifService: ListeCodifService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.userItem = this._currentUser.getRoleCurrentUser();
    this.idUtilisateur = this.route.snapshot.paramMap.get('id_utilisateur') ? parseFloat(this.route.snapshot.paramMap.get('id_utilisateur')) : null;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.pageTitleService.setTitle("Liste Investissements");
    }, 0);
    this.initForm()
    this.getSpecialites()
    this.getUtilisateurs()
    this.getBC(this.pageSize, this.pageIndex)
    this.getRevis()
  }

  openDialogModifierInvestissement(mode?, idBusinessCase?, idPartenaire?): void {
    const dialogRef = this.dialog.open(AjouterBusinessCaseComponent, {
      width: '800px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.id_investissement = idBusinessCase;
    dialogRef.componentInstance.id_partenaire = idPartenaire;
    dialogRef.componentInstance.mode = mode;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getBC(this.pageSize, this.pageIndex)
      }
    })
  }

  openDialogBusinessCase(): void {
    const dialogRef = this.dialog.open(AjouterBusinessCaseComponent, {
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

  openDialogFicheBusinessCase(id_business_case): void {
    const dialogRef = this.dialog.open(FicheBusinessCaseComponent, {
      width: '800px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.id_business_case = id_business_case;
  }

  initForm() {
    this.form = this.formBuilder.group({
      id_partenaire: [null],
      nom_partenaire: [null],
      potentiel: [null],
      code_specialite: [null],
      code_statut_bc: [null],
      id_utilisateur: [this.idUtilisateur],
      code_region: [null],
      code_ville: [{ value: null, disabled: true }],
      code_secteur: [{ value: null, disabled: true }],
    });

  }

  filtrer() {
    this.pageIndex = 0
    this.getBC(this.pageSize, this.pageIndex)
  }

  reset() {
    this.form.reset();
    this.pageIndex = 0
    this.getBC(this.pageSize, this.pageIndex)
    this.selectVille({})
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

  type_tri
  order_by
  optionTri(event) {
    this.type_tri = event?.type_tri
    this.order_by = event?.order_by
    this.getBC(this.pageSize, this.pageIndex)
  }

  getBC(records_per_page, page_number) {
    this.isLoading = true;
    this.listeBC = [];

    const body = {
      id_partenaire: this.form.controls['id_partenaire'].value,
      nom_partenaire: this.form.controls['nom_partenaire'].value,
      potentiel: this.form.controls['potentiel'].value?.length ? this.form.controls['potentiel'].value : null,
      code_specialite: this.form.controls['code_specialite'].value?.length ? this.form.controls['code_specialite'].value : null,
      code_statut_bc: this.form.controls['code_statut_bc'].value,
      id_utilisateur: this.form.controls['id_utilisateur'].value,
      code_region: this.form.controls['code_region'].value,
      code_ville: this.form.controls['code_ville'].value,
      code_secteur: this.form.controls['code_secteur'].value,
      order_by: this.order_by,
      type_tri: this.type_tri
    };

    this.businessCaseService.getBC(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listeBC = res.business_cases;
        this.totalBC = res.nbr_total_business_cases;
        this.isLoading = false;
      }, err => {
        // this.showMessageError();
        this.isLoading = false;
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

  actionInvestissement(data_mode, id_investissement): void {
    switch (data_mode) {
      case 'VALI':
        Swal.fire({
          text: "Êtes-vous sûr de vouloir valider cet investissement?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'var(--princ-health-color)',
          cancelButtonColor: '#b4b2b2',
          confirmButtonText: 'Valider',
          cancelButtonText: 'Annuler',
          heightAuto: false,
        }).then((result) => {
          if (result.value) {
            this.operationEnCours()
            this.businessCaseService.validerInvestissement(id_investissement).subscribe(success => {
              if (success?.done == false) {
                this.showMessageError();
              } else {
                this.getBC(this.pageSize, this.pageIndex);
                this.showMessageSuccess('validée');
              }
            }, err => {
              this.showMessageError();
            })
          }
        })
        break;
      case 'REJE':
        Swal.fire({
          text: "Êtes-vous sûr de vouloir rejeter cet investissement?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'var(--princ-health-color)',
          cancelButtonColor: '#b4b2b2',
          confirmButtonText: 'Rejeter',
          cancelButtonText: 'Annuler',
          heightAuto: false,
        }).then((result) => {
          if (result.value) {
            this.operationEnCours()
            this.businessCaseService.rejeterInvestissement(id_investissement).subscribe(res => {
              this.getBC(this.pageSize, this.pageIndex);
              this.showMessageSuccess('rejetée')
            }, err => {
              this.showMessageError();
            })
          }
        })
        break;
      case 'REAL':
        Swal.fire({
          text: "Êtes-vous sûr de vouloir indiquer que cette demande d'investissement a été réalisée?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'var(--princ-health-color)',
          cancelButtonColor: '#b4b2b2',
          confirmButtonText: 'Réaliser',
          cancelButtonText: 'Annuler',
          heightAuto: false,
        }).then((result) => {
          if (result.value) {
            this.operationEnCours()
            this.businessCaseService.realiserInvestissement(id_investissement).subscribe(success => {
              if (success?.done == false) {
                this.showMessageError();
              } else {
                this.getBC(this.pageSize, this.pageIndex);
                this.showMessageSuccess('realisée');
              }
            }, err => {
              this.showMessageError();
            })
          }
        })
        break;
      default: break;
    }
  }

  operationEnCours() {
    Swal.fire({
      title: 'Opération est en cours!',
      heightAuto: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
  }

  showMessageSuccess(msg) {
    Swal.fire({
      icon: 'success',
      text: `Cette demande d'investissement a été ` + msg + ` avec succès`,
      showConfirmButton: true,
      heightAuto: false,
      timer: 3500
    });
  }
  showMessageError() {
    Swal.fire({
      icon: 'error',
      text: `une erreur s'est produite. veuillez réessayer ultérieurement.`,
      showConfirmButton: false,
      heightAuto: false,
      timer: 2500,
    });
  }

  getNextPage(event) {
    this.pageSize = event.pageSize
    this.pageIndex = event.pageIndex
    this.getBC(event.pageSize, event.pageIndex)
  }

  exportBc() {
    this.isExporting = true;
    const body = {
      id_partenaire: this.form.controls['id_partenaire'].value,
      nom_partenaire: this.form.controls['nom_partenaire'].value,
      potentiel: this.form.controls['potentiel'].value?.length ? this.form.controls['potentiel'].value : null,
      code_specialite: this.form.controls['code_specialite'].value?.length ? this.form.controls['code_specialite'].value : null,
      code_statut_bc: this.form.controls['code_statut_bc'].value,
      id_utilisateur: this.form.controls['id_utilisateur'].value,
      code_region: this.form.controls['code_region'].value,
      code_ville: this.form.controls['code_ville'].value,
      code_secteur: this.form.controls['code_secteur'].value,
      order_by: this.order_by,
      type_tri: this.type_tri
    }
    this.businessCaseService.exportBc(body)
      .subscribe((res: any) => {

        const filename = `Investissements_${moment(new Date()).format("YYYY-MM-DD_HH-mm")}.xlsx`;
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
}
