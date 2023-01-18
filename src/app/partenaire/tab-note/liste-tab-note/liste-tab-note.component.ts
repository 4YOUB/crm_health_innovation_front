import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PartenaireService } from 'app/service/partenaire-service/partenaire.service';
import { TabModalAjoutNoteComponent } from '../tab-modal-ajout-note/tab-modal-ajout-note.component';
import { TabModalNoteComponent } from '../tab-modal-note/tab-modal-note.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import Swal from 'sweetalert2';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Objets par page';

  return customPaginatorIntl;
}
@Component({
  selector: 'ms-liste-tab-note',
  templateUrl: './liste-tab-note.component.html',
  styleUrls: ['./liste-tab-note.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ListeTabNoteComponent implements OnInit {
  @Input('idPartenaire') idPartenaire;
  @Input('userItem') userItem;
  isLoading
  totalNotes
  listeNotes = [];
  commentaire
  pageSize = 5
  pageIndex = 0
  constructor(
    private partenaireService: PartenaireService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getNote(this.pageSize, this.pageIndex);
  }

  getNote(records_per_page, page_number) {
    this.isLoading = true;
    this.listeNotes = []

    const body = {
      id_partenaire: this.idPartenaire
    };

    this.partenaireService.getTabNote(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listeNotes = res.notes;
        this.totalNotes = res.nbr_total_notes;
        this.isLoading = false;
      }, err => {
        // this.showMessageError();
        this.isLoading = false;
      })

  }

  getNextPage(event) {
    this.pageSize = event.pageSize
    this.pageIndex = event.pageIndex
    this.getNote(event.pageSize, event.pageIndex);
  }

  openDialogNote(commentaire): void {
    const dialogRef = this.dialog.open(TabModalNoteComponent, {
      width: '700px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.commentaire = commentaire;
  }

  openDialogAjouterNote() {
    const dialogRef = this.dialog.open(TabModalAjoutNoteComponent, {
      width: '500px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.idPartenaire = this.idPartenaire;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getNote(this.pageSize, 0);
        // ok Valider
      }
    })
  }

  actionSupprimer(id_note) {
    Swal.fire({
      text: "Êtes-vous sûr de vouloir supprimer la note ?",
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
        this.partenaireService.supprimerNote(id_note).subscribe(res => {
          this.getNote(this.pageSize, this.pageIndex);
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
      text: `Votre note a été supprimée avec succès`,
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
