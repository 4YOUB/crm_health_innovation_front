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
  selector: 'ms-liste-feedback',
  templateUrl: './liste-feedback.component.html',
  styleUrls: ['../page-parametrage/page-parametrage.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ListeFeedbackComponent implements OnInit {

  userItem;
  totalFeedback;
  listeFeedback = []
  form: FormGroup;
  isLoading;
  pageSizeFeedback = 5
  pageIndexFeedback = 0
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
      this.pageTitleService.setTitle("Feedback");
    }, 0);
    this.initForm()
    this.getListeCodifFeedback(this.pageSizeFeedback, this.pageIndexFeedback)
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
        this.getListeCodifFeedback(this.pageSizeFeedback, this.pageIndexFeedback)
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
    this.pageIndexFeedback = 0

    this.getListeCodifFeedback(this.pageSizeFeedback, this.pageIndexFeedback)
  }

  reset() {
    this.form.reset();
    this.pageIndexFeedback = 0

    this.getListeCodifFeedback(this.pageSizeFeedback, this.pageIndexFeedback)
  }

  type_triFeedback
  order_byFeedback
  optionTriFeedback(event) {
    this.type_triFeedback = event?.type_tri
    this.order_byFeedback = event?.order_by
    this.getListeCodifFeedback(this.pageSizeFeedback, this.pageIndexFeedback)
  }

  getListeCodifFeedback(records_per_page, page_number) {
    this.isLoading = true;
    this.listeFeedback = [];

    const body = {
      type_codification: "FEED",
      code_codification: this.form.controls['code_codification'].value,
      libelle_codification: this.form.controls['libelle_codification'].value,
      flag_actif: this.form.controls['flag_actif'].value,
      code_parent: null,
      libelle_parent: null,
      order_by: this.order_byFeedback,
      type_tri: this.type_triFeedback
    };

    this.listeCodifService.getCodifParametrages(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listeFeedback = res.codification;
        this.totalFeedback = res.nbr_total_codification;
        this.isLoading = false;
      }, err => {
        // this.showMessageError();
        this.isLoading = false;
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
                this.getListeCodifFeedback(this.pageSizeFeedback, this.pageIndexFeedback)
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
              this.getListeCodifFeedback(this.pageSizeFeedback, this.pageIndexFeedback)
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

  getNextPageFeedback(event) {
    this.pageSizeFeedback = event.pageSize
    this.pageIndexFeedback = event.pageIndex
    this.getListeCodifFeedback(this.pageSizeFeedback, this.pageIndexFeedback)
  }

}
