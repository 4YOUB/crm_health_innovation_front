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
  selector: 'ms-liste-gammes-specialites',
  templateUrl: './liste-gammes-specialites.component.html',
  styleUrls: ['../page-administration/page-administration.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ListeGammesSpecialitesComponent implements OnInit {

  userItem;
  isLoadingGammes;
  isLoadingSpecialites;
  totalGammes;
  listeGammes = []
  totalSpecialites;
  listeSpecialites = []
  form: FormGroup;
  pageSizeGammes = 5
  pageIndexGammes = 0
  pageSizeSpecialites = 5
  pageIndexSpecialites = 0
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
      this.pageTitleService.setTitle("Gammes/Spécialités");
    }, 0);
    this.initForm()
    this.getAllListe()
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
    this.pageIndexGammes = 0
    this.pageIndexSpecialites = 0

    this.getAllListe()
  }

  reset() {
    this.form.reset();
    this.pageIndexGammes = 0
    this.pageIndexSpecialites = 0

    this.getAllListe()
  }

  type_triGammes
  order_byGammes
  optionTriGammes(event) {
    this.type_triGammes = event?.type_tri
    this.order_byGammes = event?.order_by
    this.getListeCodifGammes(this.pageSizeGammes, this.pageIndexGammes)
  }

  type_triSpecialites
  order_bySpecialites
  optionTriSpecialites(event) {
    this.type_triSpecialites = event?.type_tri
    this.order_bySpecialites = event?.order_by
    this.getListeCodifSpecialites(this.pageSizeSpecialites, this.pageIndexSpecialites)
  }

  getAllListe() {
    this.getListeCodifGammes(this.pageSizeGammes, this.pageIndexGammes)
    this.getListeCodifSpecialites(this.pageSizeSpecialites, this.pageIndexSpecialites)
  }

  getListeCodifGammes(records_per_page, page_number) {
    this.isLoadingGammes = true;
    this.listeGammes = [];

    const body = {
      type_codification: "GAMM",
      code_codification: this.form.controls['code_codification'].value,
      libelle_codification: this.form.controls['libelle_codification'].value,
      flag_actif: null,
      code_parent: null,
      libelle_parent: null,
      order_by: this.order_byGammes,
      type_tri: this.type_triGammes
    };

    this.listeCodifService.getCodifParametrages(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listeGammes = res.codification;
        this.totalGammes = res.nbr_total_codification;
        this.isLoadingGammes = false;
      }, err => {
        // this.showMessageError();
        this.isLoadingGammes = false;
      })
  }

  getListeCodifSpecialites(records_per_page, page_number) {
    this.isLoadingSpecialites = true;
    this.listeSpecialites = [];

    const body = {
      type_codification: "SPEC",
      code_codification: this.form.controls['code_codification'].value,
      libelle_codification: this.form.controls['libelle_codification'].value,
      flag_actif: null,
      code_parent: this.form.controls['code_parent'].value,
      libelle_parent: this.form.controls['libelle_parent'].value,
      order_by: this.order_bySpecialites,
      type_tri: this.type_triSpecialites
    };

    this.listeCodifService.getCodifParametrages(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listeSpecialites = res.codification;
        this.totalSpecialites = res.nbr_total_codification;
        this.isLoadingSpecialites = false;
      }, err => {
        // this.showMessageError();
        this.isLoadingSpecialites = false;
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
                this.getListeCodifGammes(this.pageSizeGammes, this.pageIndexGammes)
                this.getListeCodifSpecialites(this.pageSizeSpecialites, this.pageIndexSpecialites)
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
              this.getListeCodifGammes(this.pageSizeGammes, this.pageIndexGammes)
              this.getListeCodifSpecialites(this.pageSizeSpecialites, this.pageIndexSpecialites)
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

  getNextPageGammes(event) {
    this.pageSizeGammes = event.pageSize
    this.pageIndexGammes = event.pageIndex
    this.getListeCodifGammes(this.pageSizeGammes, this.pageIndexGammes)
  }

  getNextPageSpecialites(event) {
    this.pageSizeSpecialites = event.pageSize
    this.pageIndexSpecialites = event.pageIndex
    this.getListeCodifSpecialites(this.pageSizeSpecialites, this.pageIndexSpecialites)
  }

}
