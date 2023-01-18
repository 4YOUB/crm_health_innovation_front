import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PartenaireService } from 'app/service/partenaire-service/partenaire.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'ms-tab-modal-ajout-note',
  templateUrl: './tab-modal-ajout-note.component.html',
  styleUrls: ['./tab-modal-ajout-note.component.scss']
})
export class TabModalAjoutNoteComponent implements OnInit {
  idPartenaire
  form: FormGroup;
  isSubmitted: boolean = false;
  constructor(public dialogRef: MatDialogRef<TabModalAjoutNoteComponent>,
    private formBuilder: FormBuilder,
    private partenaireService: PartenaireService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      commentaire: [null],
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
        const body = {
          id_partenaire: this.idPartenaire,
          commentaire: this.form.value.commentaire
        }
        this.partenaireService.ajouterNote(body).subscribe(success => {
          this.showMessageSuc(`Votre note a été ajoutée avec succès`);
        }, error => {
          this.showMessageError();
        })
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


}
