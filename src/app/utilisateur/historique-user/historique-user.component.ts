import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { UtilisateurService } from 'app/service/utilisateur-service/utilisateur.service';
export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Objets par page';

  return customPaginatorIntl;
}
@Component({
  selector: 'ms-historique-user',
  templateUrl: './historique-user.component.html',
  styleUrls: ['./historique-user.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class HistoriqueUserComponent implements OnInit {
  id_utilisateur
  nom_utilisateur
  listeHistoriqueUser = []
  totalHistoriqueUser
  pageSize = 5
  pageIndex = 0
  isLoading
  constructor(public dialogRef: MatDialogRef<HistoriqueUserComponent>,
    private utilisateurService: UtilisateurService,) { }

  ngOnInit(): void {
    this.getVisite(this.pageSize, this.pageIndex)

  }

  getVisite(records_per_page, page_number) {
    this.isLoading = true;
    this.listeHistoriqueUser = []


    this.utilisateurService.getHistoriqueUser(this.id_utilisateur,records_per_page, page_number)
      .subscribe((res: any) => {
        this.listeHistoriqueUser = res.historique;
        this.totalHistoriqueUser = res.nbr_total_historique;
        this.isLoading = false;
      }, err => {
        // this.showMessageError();
        this.isLoading = false;
      })

  }

  getNextPage(event) {
    this.pageSize = event.pageSize
    this.pageIndex = event.pageIndex
    this.getVisite(event.pageSize, event.pageIndex)
  }

}
