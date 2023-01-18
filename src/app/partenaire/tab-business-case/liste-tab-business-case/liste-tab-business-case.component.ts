import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PartenaireService } from 'app/service/partenaire-service/partenaire.service';
import { TabModalCommentaireComponent } from '../tab-modal-commentaire/tab-modal-commentaire.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AjouterBusinessCaseComponent } from 'app/business-case/ajouter-business-case/ajouter-business-case.component';
import { FicheBusinessCaseComponent } from 'app/business-case/fiche-business-case/fiche-business-case.component';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Objets par page';

  return customPaginatorIntl;
}
@Component({
  selector: 'ms-liste-tab-business-case',
  templateUrl: './liste-tab-business-case.component.html',
  styleUrls: ['./liste-tab-business-case.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ListeTabBusinessCaseComponent implements OnInit {

  @Input('idPartenaire') idPartenaire;
  @Input('userItem') userItem;
  @Input('statutPartenaire') statutPartenaire;
  isLoading
  totalBusinessCases
  listeBusinessCases = []
  pageSize = 5
  pageIndex = 0
  constructor(private partenaireService: PartenaireService,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.getBusinessCases(this.pageSize, this.pageIndex)
  }

  getBusinessCases(records_per_page, page_number) {
    this.isLoading = true;
    this.listeBusinessCases = []

    const body = {
      id_partenaire: this.idPartenaire
    };

    this.partenaireService.getTabBusinessCases(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listeBusinessCases = res.business_cases;
        this.totalBusinessCases = res.nbr_total_business_cases;
        this.isLoading = false;
      }, err => {
        // this.showMessageError();
        this.isLoading = false;
      })

  }

  openDialogAjouterBusinessCase(): void {
    const dialogRef = this.dialog.open(AjouterBusinessCaseComponent, {
      width: '800px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.userItem = this.userItem;
    dialogRef.componentInstance.id_partenaire = this.idPartenaire;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getBusinessCases(this.pageSize, this.pageIndex)
      }
    })
  }

  openDialogModifierInvestissement(mode?, idBusinessCase?): void {
		const dialogRef = this.dialog.open(AjouterBusinessCaseComponent, {
			width: '800px',
			autoFocus: false,
      maxHeight: '90vh'
		});
    dialogRef.componentInstance.id_investissement = idBusinessCase;
    dialogRef.componentInstance.id_partenaire = this.idPartenaire;
    dialogRef.componentInstance.mode = mode;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getBusinessCases(this.pageSize, this.pageIndex)
      }
    })
	}

  getNextPage(event) {
    this.pageSize = event.pageSize
    this.pageIndex = event.pageIndex
    this.getBusinessCases(event.pageSize, event.pageIndex)
  }

  openDialogCommentaire(commentaire): void {
		const dialogRef = this.dialog.open(TabModalCommentaireComponent, {
			width: '700px',
			autoFocus: false,
      maxHeight: '90vh'
		});
    dialogRef.componentInstance.commentaire = commentaire;
	}

  openDialogFicheBusinessCase(id_business_case): void {
		const dialogRef = this.dialog.open(FicheBusinessCaseComponent, {
			width: '800px',
			autoFocus: false,
      maxHeight: '90vh'
		});
    dialogRef.componentInstance.id_business_case = id_business_case;
	}

}
