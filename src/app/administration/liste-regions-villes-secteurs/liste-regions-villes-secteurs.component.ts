import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageTitleService } from 'app/core/page-title/page-title.service';
import { CurrentUserService } from 'app/service/current-user.service';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { AjouterCodifComponent } from 'app/widget-component/ajouter-codif/ajouter-codif.component';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Objets par page';

  return customPaginatorIntl;
}
@Component({
  selector: 'ms-liste-regions-villes-secteurs',
  templateUrl: './liste-regions-villes-secteurs.component.html',
  styleUrls: ['../page-administration/page-administration.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ListeRegionsVillesSecteursComponent implements OnInit {


  userItem;
  totalRegions;
  listeRegions = []
  totalVilles;
  listeVilles = []
  totalSecteurs;
  listeSecteurs = []
  form: FormGroup;
  isLoadingRegions;
  isLoadingVilles;
  isLoadingSecteurs;
  pageSizeRegions = 5
  pageIndexRegions = 0
  pageSizeVilles = 5
  pageIndexVilles = 0
  pageSizeSecteurs = 5
  pageIndexSecteurs = 0
  constructor(
    private formBuilder: FormBuilder,
    private pageTitleService: PageTitleService,
    private _currentUser: CurrentUserService,
    private listeCodifService: ListeCodifService,
    public dialog: MatDialog,
  ) {
    this.userItem = this._currentUser.getRoleCurrentUser();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.pageTitleService.setTitle("Régions/Villes/Secteurs");
    }, 0);
    this.initForm()
    this.getListeCodifRegions(this.pageSizeRegions, this.pageIndexRegions)
    this.getListeCodifVilles(this.pageSizeVilles, this.pageIndexVilles)
    this.getListeCodifSecteurs(this.pageSizeSecteurs, this.pageIndexSecteurs)

  }

  openDialogModifierCodif(item, title_type, type_parent?): void {
    const dialogRef = this.dialog.open(AjouterCodifComponent, {
      width: '400px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.mode = 'modifier';
    dialogRef.componentInstance.title_type = title_type;
    dialogRef.componentInstance.type_parent = type_parent;
    dialogRef.componentInstance.item_codification = item;
    dialogRef.componentInstance.type_codification = item.type_codification;
    dialogRef.componentInstance.code_codification = item.code_codification;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllListe()
      }
    })
  }

  openDialogAjouterCodif(type_codification, title_type, type_parent?): void {
    const dialogRef = this.dialog.open(AjouterCodifComponent, {
      width: '400px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.type_codification = type_codification;
    dialogRef.componentInstance.title_type = title_type;
    dialogRef.componentInstance.type_parent = type_parent;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reset()
        // ok Valider
      }
    })
  }

  initForm() {
    this.form = this.formBuilder.group({
      code_codification: [null],
      libelle_codification: [null],
      code_parent: [null],
      libelle_parent: [null],
    });

  }

  filtrer() {
    this.pageIndexRegions = 0
    this.pageIndexVilles = 0
    this.pageIndexSecteurs = 0

    this.getAllListe()
  }

  reset() {
    this.form.reset();
    this.pageIndexRegions = 0
    this.pageIndexVilles = 0
    this.pageIndexSecteurs = 0

    this.getAllListe()
  }

  type_triRegions
  order_byRegions
  optionTriRegions(event) {
    this.type_triRegions = event?.type_tri
    this.order_byRegions = event?.order_by
    this.getListeCodifRegions(this.pageSizeRegions, this.pageIndexRegions)
  }

  type_triVilles
  order_byVilles
  optionTriVilles(event) {
    this.type_triVilles = event?.type_tri
    this.order_byVilles = event?.order_by
    this.getListeCodifVilles(this.pageSizeVilles, this.pageIndexVilles)
  }

  type_triSecteurs
  order_bySecteurs
  optionTriSecteurs(event) {
    this.type_triSecteurs = event?.type_tri
    this.order_bySecteurs = event?.order_by
    this.getListeCodifSecteurs(this.pageSizeSecteurs, this.pageIndexSecteurs)
  }

  getAllListe() {
    this.getListeCodifRegions(this.pageSizeRegions, this.pageIndexRegions)
    this.getListeCodifVilles(this.pageSizeVilles, this.pageIndexVilles)
    this.getListeCodifSecteurs(this.pageSizeSecteurs, this.pageIndexSecteurs)
  }

  getListeCodifRegions(records_per_page, page_number) {
    this.isLoadingRegions = true;
    this.listeRegions = [];

    const body = {
      type_codification: "REGI",
      code_codification: this.form.controls['code_codification'].value,
      libelle_codification: this.form.controls['libelle_codification'].value,
      flag_actif: null,
      code_parent: null,
      libelle_parent: null,
      order_by: this.order_byRegions,
      type_tri: this.type_triRegions
    };

    this.listeCodifService.getCodifParametrages(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listeRegions = res.codification;
        this.totalRegions = res.nbr_total_codification;
        this.isLoadingRegions = false;
      }, err => {
        // this.showMessageError();
        this.isLoadingRegions = false;
      })
  }

  getListeCodifVilles(records_per_page, page_number) {
    this.isLoadingVilles = true;
    this.listeVilles = [];

    const body = {
      type_codification: "VILL",
      code_codification: this.form.controls['code_codification'].value,
      libelle_codification: this.form.controls['libelle_codification'].value,
      flag_actif: null,
      code_parent: this.form.controls['code_parent'].value,
      libelle_parent: this.form.controls['libelle_parent'].value,
      order_by: this.order_byVilles,
      type_tri: this.type_triVilles
    };

    this.listeCodifService.getCodifParametrages(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listeVilles = res.codification;
        this.totalVilles = res.nbr_total_codification;
        this.isLoadingVilles = false;
      }, err => {
        // this.showMessageError();
        this.isLoadingVilles = false;
      })
  }

  getListeCodifSecteurs(records_per_page, page_number) {
    this.isLoadingSecteurs = true;
    this.listeSecteurs = [];

    const body = {
      type_codification: "SECT",
      code_codification: this.form.controls['code_codification'].value,
      libelle_codification: this.form.controls['libelle_codification'].value,
      flag_actif: null,
      code_parent: this.form.controls['code_parent'].value,
      libelle_parent: this.form.controls['libelle_parent'].value,
      order_by: this.order_bySecteurs,
      type_tri: this.type_triSecteurs
    };

    this.listeCodifService.getCodifParametrages(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listeSecteurs = res.codification;
        this.totalSecteurs = res.nbr_total_codification;
        this.isLoadingSecteurs = false;
      }, err => {
        // this.showMessageError();
        this.isLoadingSecteurs = false;
      })
  }

  actionCodif(data_mode, type_codification, code_codification): void {
    const body = {
      type_codification: type_codification,
      code_codification: code_codification
    };
    switch (data_mode) {
      case 'VALI':
        Swal.fire({
          text: "Êtes-vous sûr de vouloir activer?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'var(--princ-health-color)',
          cancelButtonColor: '#b4b2b2',
          confirmButtonText: 'Activer',
          cancelButtonText: 'Annuler',
          heightAuto: false,
        }).then((result) => {
          if (result.value) {
            this.operationEnCours()
            this.listeCodifService.activerCodif(body).subscribe(success => {
              if (success?.done == false) {
                this.showMessageError();
              } else {
                this.getAllListe()
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
          text: "Êtes-vous sûr de vouloir désactiver?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'var(--princ-health-color)',
          cancelButtonColor: '#b4b2b2',
          confirmButtonText: 'Désactiver',
          cancelButtonText: 'Annuler',
          heightAuto: false,
        }).then((result) => {
          if (result.value) {
            this.operationEnCours()
            this.listeCodifService.desactiverCodif(body).subscribe(res => {
              this.getAllListe()
              this.showMessageSuccess('rejetée')
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
      text: `Cette demande a été ` + msg + ` avec succès`,
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

  getNextPageRegions(event) {
    this.pageSizeRegions = event.pageSize
    this.pageIndexRegions = event.pageIndex
    this.getListeCodifRegions(this.pageSizeRegions, this.pageIndexRegions)
  }

  getNextPageVilles(event) {
    this.pageSizeVilles = event.pageSize
    this.pageIndexVilles = event.pageIndex
    this.getListeCodifVilles(this.pageSizeVilles, this.pageIndexVilles)
  }

  getNextPageSecteurs(event) {
    this.pageSizeSecteurs = event.pageSize
    this.pageIndexSecteurs = event.pageIndex
    this.getListeCodifSecteurs(this.pageSizeSecteurs, this.pageIndexSecteurs)
  }

}
