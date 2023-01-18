import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PartenaireService } from 'app/service/partenaire-service/partenaire.service';
import { AjouterVisiteComponent } from 'app/visite/ajouter-visite/ajouter-visite.component';
import { TabModalProduitsComponent } from '../tab-modal-produits/tab-modal-produits.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { FicheVisiteComponent } from 'app/visite/fiche-visite/fiche-visite.component';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Objets par page';

  return customPaginatorIntl;
}
@Component({
  selector: 'ms-liste-tab-visite',
  templateUrl: './liste-tab-visite.component.html',
  styleUrls: ['./liste-tab-visite.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ListeTabVisiteComponent implements OnInit {
  @Input('idPartenaire') idPartenaire;
  @Input('userItem') userItem;
  @Input('statutPartenaire') statutPartenaire;

  isLoading
  totalVisites
  listeVisites = []
  @Output() resetData: EventEmitter<any> = new EventEmitter();
  pageSize = 5
  pageIndex = 0
  constructor(private partenaireService: PartenaireService,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.getVisite(this.pageSize, this.pageIndex)
  }

  getVisite(records_per_page, page_number) {
    this.isLoading = true;
    this.listeVisites = []

    const body = {
      id_partenaire: this.idPartenaire
    };

    this.partenaireService.getTabVisite(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listeVisites = res.visites;
        this.totalVisites = res.nbr_total_visites;
        this.isLoading = false;
      }, err => {
        // this.showMessageError();
        this.isLoading = false;
      })

  }

  openDialogAjouterVisite(): void {
    const dialogRef = this.dialog.open(AjouterVisiteComponent, {
      width: '900px',
      autoFocus: false,
      maxHeight: '90vh',
      maxWidth: '80vw',
    });
    dialogRef.componentInstance.idPartenaire = this.idPartenaire;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resetData.emit(true);
        this.getVisite(this.pageSize, 0)
        // ok Valider
      }
    })
  }

  openDialogFicheVisite(id_visite): void {
    const dialogRef = this.dialog.open(FicheVisiteComponent, {
      width: '700px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.userItem = this.userItem;
    dialogRef.componentInstance.id_visite = id_visite
  }

  getNextPage(event) {
    this.pageSize = event.pageSize
    this.pageIndex = event.pageIndex
    this.getVisite(event.pageSize, event.pageIndex)
  }

  openDialogProduits(produits): void {
    const dialogRef = this.dialog.open(TabModalProduitsComponent, {
      width: '800px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.listeProduits = produits;
  }

  openDialogModifierVisite(mode?, idVisite?, idPlanification?): void {
    const dialogRef = this.dialog.open(AjouterVisiteComponent, {
      width: '900px',
      autoFocus: false,
      maxHeight: '90vh',
      maxWidth: '80vw',
    });
    dialogRef.componentInstance.id_visite = idVisite;
    dialogRef.componentInstance.idPartenaire = this.idPartenaire;
    dialogRef.componentInstance.id_planification = idPlanification;
    dialogRef.componentInstance.mode = mode;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getVisite(this.pageSize, this.pageIndex)
        // ok Valider
      }
    })
  }
}
