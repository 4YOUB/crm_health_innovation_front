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
  selector: 'ms-liste-etablissement',
  templateUrl: './liste-etablissement.component.html',
  styleUrls: ['../page-parametrage/page-parametrage.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ListeEtablissementComponent implements OnInit {

  userItem;
  isLoadingPublic;
  isLoadingPrive;
  totalEtablissementPublic;
  listeEtablissementPublic = []
  totalEtablissementPrive;
  listeEtablissementPrive = []
  form: FormGroup;
  pageSizeEtablissementPublic = 5
  pageIndexEtablissementPublic = 0
  pageSizeEtablissementPrive = 5
  pageIndexEtablissementPrive = 0
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
      this.pageTitleService.setTitle("Établissement");
    }, 0);
    this.initForm()
    this.getAllListe()
  }

  openDialogModifierCodif(item, title_type): void {
    const dialogRef = this.dialog.open(AjouterCodifComponent, {
      width: '400px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.mode = 'modifier';
    dialogRef.componentInstance.title_type = title_type;
    dialogRef.componentInstance.item_codification = item;
    dialogRef.componentInstance.type_codification = item.type_codification;
    dialogRef.componentInstance.code_codification = item.code_codification;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllListe()
      }
    })
  }

  openDialogAjouterCodif(type_codification, title_type): void {
    const dialogRef = this.dialog.open(AjouterCodifComponent, {
      width: '400px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.type_codification = type_codification;
    dialogRef.componentInstance.title_type = title_type;
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
      flag_actif: [null],
    });

  }

  filtrer() {
    this.pageIndexEtablissementPublic = 0
    this.pageIndexEtablissementPrive = 0

    this.getAllListe()
  }

  reset() {
    this.form.reset();
    this.pageIndexEtablissementPublic = 0
    this.pageIndexEtablissementPrive = 0

    this.getAllListe()
  }

  type_triEtablissementPublic
  order_byEtablissementPublic
  optionTriEtablissementPublic(event) {
    this.type_triEtablissementPublic = event?.type_tri
    this.order_byEtablissementPublic = event?.order_by
    this.getListeCodifEtablissementPublic(this.pageSizeEtablissementPublic, this.pageIndexEtablissementPublic)
  }

  type_triEtablissementPrive
  order_byEtablissementPrive
  optionTriEtablissementPrive(event) {
    this.type_triEtablissementPrive = event?.type_tri
    this.order_byEtablissementPrive = event?.order_by
    this.getListeCodifEtablissementPrive(this.pageSizeEtablissementPrive, this.pageIndexEtablissementPrive)
  }

  getAllListe() {
    this.getListeCodifEtablissementPublic(this.pageSizeEtablissementPublic, this.pageIndexEtablissementPublic)
    this.getListeCodifEtablissementPrive(this.pageSizeEtablissementPrive, this.pageIndexEtablissementPrive)

  }

  getListeCodifEtablissementPublic(records_per_page, page_number) {
    this.isLoadingPublic = true;
    this.listeEtablissementPublic = [];

    const body = {
      type_codification: "ETPU",
      code_codification: this.form.controls['code_codification'].value,
      libelle_codification: this.form.controls['libelle_codification'].value,
      flag_actif: this.form.controls['flag_actif'].value,
      code_parent: null,
      libelle_parent: null,
      order_by: this.order_byEtablissementPublic,
      type_tri: this.type_triEtablissementPublic
    };

    this.listeCodifService.getCodifParametrages(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listeEtablissementPublic = res.codification;
        this.totalEtablissementPublic = res.nbr_total_codification;
        this.isLoadingPublic = false;
      }, err => {
        // this.showMessageError();
        this.isLoadingPublic = false;
      })
  }


  getListeCodifEtablissementPrive(records_per_page, page_number) {
    this.isLoadingPrive = true;
    this.listeEtablissementPrive = [];

    const body = {
      type_codification: "ETPR",
      code_codification: this.form.controls['code_codification'].value,
      libelle_codification: this.form.controls['libelle_codification'].value,
      flag_actif: this.form.controls['flag_actif'].value,
      code_parent: null,
      libelle_parent: null,
      order_by: this.order_byEtablissementPrive,
      type_tri: this.type_triEtablissementPrive
    };

    this.listeCodifService.getCodifParametrages(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listeEtablissementPrive = res.codification;
        this.totalEtablissementPrive = res.nbr_total_codification;
        this.isLoadingPrive = false;
      }, err => {
        // this.showMessageError();
        this.isLoadingPrive = false;
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
                this.getListeCodifEtablissementPublic(this.pageSizeEtablissementPublic, this.pageIndexEtablissementPublic)
                this.getListeCodifEtablissementPrive(this.pageSizeEtablissementPrive, this.pageIndexEtablissementPrive)
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
              this.getListeCodifEtablissementPublic(this.pageSizeEtablissementPublic, this.pageIndexEtablissementPublic)
              this.getListeCodifEtablissementPrive(this.pageSizeEtablissementPrive, this.pageIndexEtablissementPrive)
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

  getNextPageEtablissementPublic(event) {
    this.pageSizeEtablissementPublic = event.pageSize
    this.pageIndexEtablissementPublic = event.pageIndex
    this.getListeCodifEtablissementPublic(this.pageSizeEtablissementPublic, this.pageIndexEtablissementPublic)
  }

  getNextPageEtablissementPrive(event) {
    this.pageSizeEtablissementPrive = event.pageSize
    this.pageIndexEtablissementPrive = event.pageIndex
    this.getListeCodifEtablissementPrive(this.pageSizeEtablissementPrive, this.pageIndexEtablissementPrive)
  }

}
