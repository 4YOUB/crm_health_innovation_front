import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PartenaireService } from 'app/service/partenaire-service/partenaire.service';
import { TabAjouterDocumentComponent } from '../tab-ajouter-document/tab-ajouter-document.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import Swal from 'sweetalert2';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Objets par page';

  return customPaginatorIntl;
}
@Component({
  selector: 'ms-liste-tab-document',
  templateUrl: './liste-tab-document.component.html',
  styleUrls: ['./liste-tab-document.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ListeTabDocumentComponent implements OnInit {
  @Input('idPartenaire') idPartenaire;
  @Input('userItem') userItem;
  isLoading
  totalDocuments
  listeDocuments = []
  pageSize = 5
  pageIndex = 0
  constructor(private partenaireService: PartenaireService,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.getDocuments(this.pageSize, this.pageIndex)
  }

  getDocuments(records_per_page, page_number) {
    this.isLoading = true;
    this.listeDocuments = []

    const body = {
      id_partenaire: this.idPartenaire
    };

    this.partenaireService.getTabDocuments(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listeDocuments = res.documents;
        this.totalDocuments = res.nbr_total_documents;
        this.isLoading = false;
      }, err => {
        // this.showMessageError();
        this.isLoading = false;
      })

  }

  getNextPage(event) {
    this.pageSize = event.pageSize
    this.pageIndex = event.pageIndex
    this.getDocuments(event.pageSize, event.pageIndex)
  }

  openDialogAjouterDocument(): void {
    const dialogRef = this.dialog.open(TabAjouterDocumentComponent, {
      width: '500px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.idPartenaire = this.idPartenaire;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDocuments(this.pageSize, 0)
        // ok Valider
      }
    })
  }

  actionSupprimer(id_document) {
    Swal.fire({
      text: "Êtes-vous sûr de vouloir supprimer le document ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--princ-health-color)',
      cancelButtonColor: '#b4b2b2',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      heightAuto: false,
    }).then((result) => {
      if (result.value) {
        this.oerationEnCours()
        this.partenaireService.supprimerDocuments(id_document).subscribe(res => {
          this.getDocuments(this.pageSize, this.pageIndex);
          this.showMessageSuccess()
        }, err => {
          this.showMessageError();
        })
      }
    })
  }
  oerationEnCours() {
    Swal.fire({
      title: 'Opération est en cours!',
      heightAuto: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
  }
  showMessageSuccess() {
    Swal.fire({
      icon: 'success',
      text: `Votre document a été supprimé avec succès`,
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
}
