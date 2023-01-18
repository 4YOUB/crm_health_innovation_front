import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import Swal from 'sweetalert2';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'ms-ajouter-codif',
  templateUrl: './ajouter-codif.component.html',
  styleUrls: ['./ajouter-codif.component.scss']
})
export class AjouterCodifComponent implements OnInit {
  mode: string;
  type_codification
  code_codification
  item_codification: any;
  title_type
  type_parent
  @ViewChild(CdkVirtualScrollViewport)
  cdkVirtualScrollViewPort: CdkVirtualScrollViewport;

  userItem
  isSubmitted: boolean = false;
  form: FormGroup;
  listeCodificationt = []
  filterelisteCodificationt = []
  itemSelectCodificationt
  title: string = 'Ajouter';
  isLoading = false
  constructor(public dialogRef: MatDialogRef<AjouterCodifComponent>,
    private formBuilder: FormBuilder,
    private listeCodifService: ListeCodifService) { }

  ngOnInit(): void {
    if (this.code_codification && this.mode == 'modifier') {
      this.isLoading = true;
      this.title = 'Modifier';
      this.initForm(this.item_codification);
      setTimeout(() => {
        this.isLoading = false;
      }, 400);
    } else {
      this.initForm()
    }

    if (this.type_parent)
      this.getCodification(this.type_parent)

  }

  initForm(data?) {
    this.form = this.formBuilder.group({
      code_parent: [data ? data.code_parent : null],
      libelle_codification: [data ? data.libelle_codification : null],
      ordre_codification: [data ? data.ordre_codification : null],
    });
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
        body['type_codification'] = this.type_codification;
        body['code_codification'] = this.code_codification;
        body['type_parent'] = this.type_parent;
        if (this.mode == 'modifier') {
          this.listeCodifService.modifierCodification(body).subscribe(success => {
            this.showMessageSuc(`Votre ${this.title_type} a été modifié avec succès`);
          }, error => {
            this.showMessageError();
          })
        }
        else {
          this.listeCodifService.ajouterCodification(body).subscribe(success => {
            this.showMessageSuc(`Votre ${this.title_type} a été ajouté avec succès`);
          }, error => {
            this.showMessageError();
          })
        }

      }
    }, 100);
  }

  openChange($event: boolean) {
    if ($event) {
      this.cdkVirtualScrollViewPort.scrollToIndex(0);
      this.cdkVirtualScrollViewPort.checkViewportSize();
    }
  }

  getCodification(code) {
    const body = {
      "type_codification": code,
      "code_codification": null,
      "type_parent": null,
      "code_parent": null
    }
    this.listeCodifService.getCodification(body)
      .subscribe((res: any) => {
        this.listeCodificationt = res.codification;
        this.filterelisteCodificationt = this.listeCodificationt;
        if (this.code_codification) {
          const item = this.listeCodificationt.filter(
            item => item.code_codification == this.item_codification.code_parent
          )[0];

          this.form.get('code_parent').setValue(item.code_codification);
          this.selectCodificationt(item)
        }
      }, err => {
        // this.showMessageError();
      })
  }

  selectCodificationt(item) {
    this.itemSelectCodificationt = item
  }

  filterCodificationt(value) {
    this.filterelisteCodificationt = this.listeCodificationt.filter(
      item => item.nom_partenaire.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
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

  showMessageWarning(msg) {
    Swal.fire({
      icon: 'warning',
      text: msg,
      showConfirmButton: false,
      heightAuto: false,
      timer: 3500
    });
  }
}
