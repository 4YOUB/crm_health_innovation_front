import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PageTitleService } from 'app/core/page-title/page-title.service';
import Swal from 'sweetalert2';
import { ProduitService } from 'app/service/produit-service/produit.service';
import { AjouterProduitComponent } from '../ajouter-produit/ajouter-produit.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { GammeProduitComponent } from '../gamme-produit/gamme-produit.component';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Objets par page';

  return customPaginatorIntl;
}
@Component({
  selector: 'ms-liste-produit',
  templateUrl: './liste-produit.component.html',
  styleUrls: ['./liste-produit.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ListeProduitComponent implements OnInit {

  pageSize = 10
  pageIndex = 0
  form: FormGroup;
  isLoading: boolean = false;
  listeProduits: any[];
  totalProduits: any;

  constructor(
    private formBuilder: FormBuilder,
    private pageTitleService: PageTitleService,
    private produitService: ProduitService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.pageTitleService.setTitle("Liste Produits");
    }, 0);
    this.initForm()
    this.getProduits(this.pageSize, this.pageIndex)
  }

  initForm() {
    this.form = this.formBuilder.group({
      id_produit: [null],
      libelle_produit: [null],
      code_gamme: [null],
      code_statut_produit: [null]
    });

  }

  filtrer() {
    this.pageIndex = 0
    this.getProduits(this.pageSize, this.pageIndex)
  }

  reset() {
    this.form.reset();
    this.pageIndex = 0
    this.getProduits(this.pageSize, this.pageIndex)
  }

  type_tri
  order_by
  optionTri(event) {
    this.type_tri = event?.type_tri
    this.order_by = event?.order_by
    this.getProduits(this.pageSize, this.pageIndex)
  }

  getProduits(records_per_page, page_number) {
    this.isLoading = true;
    this.listeProduits = [];

    const body = {
      id_produit: this.form.controls['id_produit'].value,
      libelle_produit: this.form.controls['libelle_produit'].value,
      code_gamme: this.form.controls['code_gamme'].value,
      code_statut_produit: this.form.controls['code_statut_produit'].value,
      order_by: this.order_by,
      type_tri: this.type_tri
    };

    this.produitService.getProduits(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listeProduits = res.produits;
        this.totalProduits = res.nbr_total_produits;
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
      })
  }

  openDialog(data, libelle_produit): void {
    const dialogRef = this.dialog.open(GammeProduitComponent, {
      width: '400px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.listeGamme = data;
    dialogRef.componentInstance.libelle_produit = libelle_produit;
  }

  openDialogAjouterProduit(): void {
    const dialogRef = this.dialog.open(AjouterProduitComponent, {
      width: '400px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    // dialogRef.componentInstance.userItem = this.userItem;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reset()
        // ok Valider
      }
    })
  }

  openDialogModifierProduit(mode?, idProduit?): void {
    const dialogRef = this.dialog.open(AjouterProduitComponent, {
      width: '400px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.id_produit = idProduit;
    dialogRef.componentInstance.mode = mode;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProduits(this.pageSize, this.pageIndex)
      }
    })
  }

  actionProduit(data_mode, id_produit): void {
    switch (data_mode) {
      case 'ACTI':
        Swal.fire({
          text: "Êtes-vous sûr de vouloir activer ce produit?",
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
            this.produitService.activerProduit(id_produit).subscribe(success => {
              if (success?.done == false) {
                this.showMessageError();
              } else {
                this.getProduits(this.pageSize, this.pageIndex);
                this.showMessageSuccess('validée');
              }
            }, err => {
              this.showMessageError();
            })
          }
        })
        break;
      case 'DESA':
        Swal.fire({
          text: "Êtes-vous sûr de vouloir désactiver ce produit?",
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
            this.produitService.desactiverProduit(id_produit).subscribe(res => {
              this.getProduits(this.pageSize, this.pageIndex);
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
      text: `Ce produit a été ` + msg + ` avec succès`,
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
    this.getProduits(event.pageSize, event.pageIndex)
  }

}
