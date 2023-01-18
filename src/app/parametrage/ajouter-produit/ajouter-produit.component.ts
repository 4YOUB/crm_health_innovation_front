import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProduitService } from 'app/service/produit-service/produit.service';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'ms-ajouter-produit',
  templateUrl: './ajouter-produit.component.html',
  styleUrls: ['./ajouter-produit.component.scss']
})
export class AjouterProduitComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport)
  cdkVirtualScrollViewPort: CdkVirtualScrollViewport;

  userItem;
  id_produit;
  mode: string = 'ajouter';
  title: string = 'Ajouter Produit';
  isSubmitted: boolean = false;
  form: FormGroup;
  isLoading: boolean = false;
  produit: any;
  code_gamme: any;
  listeGammes: any = [];
  libelle_codification: string;
  selectedGamme: any;

  constructor(
    public dialogRef: MatDialogRef<AjouterProduitComponent>,
    private formBuilder: FormBuilder,
    private produitService: ProduitService,
    private listeCodifService: ListeCodifService
  ) { }

  ngOnInit(): void {
    this.getGamme();
    if (this.id_produit && this.mode == 'modifier') {
      this.title = 'Modifier Produit';
      this.getProduit();
    } else {
      this.initForm();
    }
  }

  initForm(data?) {
    this.form = this.formBuilder.group({
      gammes: [data ? [
        ...data.gammes.map((el) => el.code_gamme),
      ] : null],
      libelle_produit: [data ? data.libelle_produit : null],
      ordre_produit: [data ? data.ordre_produit : null]
    });
  }

  getGamme() {
    this.listeCodifService.getGammes()
      .subscribe((res: any) => {
        this.listeGammes = res.gammes;
      }, err => {
        // this.showMessageError();
      })
  }

  save() {
    this.isSubmitted = true
    setTimeout(() => {
      if (this.isSubmitted == true && this.form.valid) {
        Swal.fire({
          title: "Opération est en cours!",
          heightAuto: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        const body = this.form.value
        body['id_produit'] = this.id_produit;
        if (this.mode == 'modifier') {
          this.produitService.modifierProduit(body).subscribe(success => {
            this.showMessageSuc(`Votre produit a été modifié avec succès`);
          }, error => {
            this.showMessageError();
          })
        }
        else {
          this.produitService.ajouterProduit(body).subscribe(success => {
            this.showMessageSuc(`Votre produit a été ajouté avec succès`);
          }, error => {
            this.showMessageError();
          })
        }
      }
    }, 100);
  }

  showMessageSuc(msg) {
    Swal.fire({
      icon: 'success',
      text: msg,
      showConfirmButton: true,
      heightAuto: false,
      timer: 4000,
    });
    this.dialogRef.close(true)
  }

  showMessageError() {
    Swal.fire({
      icon: 'error',
      title: `Une erreur est survenue`,
      text: 'Veuillez réessayer plus tard',
      showConfirmButton: false,
      heightAuto: false,
      timer: 2500
    });
  }

  getProduit() {
    this.isLoading = true;
    this.produitService.getFicheProduit(this.id_produit)
      .subscribe((res: any) => {
        this.produit = res.produit;
        this.libelle_codification = this.produit.libelle_gamme
        this.initForm(this.produit);
        this.isLoading = false;
      }, err => {
        // this.showMessageError();
      })
  }

  selectGamme(item) {
    this.selectedGamme = item
  }
}
