import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BusinessCaseService } from 'app/service/business-case-service/business-case.service';
import { PartenaireService } from 'app/service/partenaire-service/partenaire.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'ms-tab-ajouter-document',
  templateUrl: './tab-ajouter-document.component.html',
  styleUrls: ['./tab-ajouter-document.component.scss']
})
export class TabAjouterDocumentComponent implements OnInit {
  idPartenaire
  userItem
  isSubmitted: boolean = false;
  form: FormGroup;
  imgUpload
  localUrl: any;
  selectedFiles
  constructor(public dialogRef: MatDialogRef<TabAjouterDocumentComponent>,
    private formBuilder: FormBuilder,
    private businessCaseService: BusinessCaseService,
    private partenaireService: PartenaireService,) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.form = this.formBuilder.group({
      id_partenaire: [this.idPartenaire],
      id_document: [null],
      nom_document: [null],
    });
  }

  save() {
    this.isSubmitted = true
    setTimeout(() => {
      if (this.localUrl) {
        if (this.isSubmitted == true && this.form.valid) {
          if (this.form.controls['id_document'].value) {
            Swal.fire({
              title: "Opération est en cours!",
              heightAuto: false,
              didOpen: () => {
                Swal.showLoading(null);
              }
            });
            const body = this.form.value
            this.partenaireService.ajouterDocument(body).subscribe(success => {
              this.showMessageSuc(`Votre document a été ajouté avec succès`);
            }, error => {
              this.showMessageError();
            })
          } else {
            this.showMessageWarning("Veuillez patientez quelques instants,, nous chargeons votre document")
          }
        }
      } else {
        this.showMessageWarning("Veuillez téléchargez votre fichier")
      }
    }, 100);
  }

  extensionFile
  nameFile
  selectFile(event: any) {

    var file = event.target.files[0];
    this.nameFile = file.name
    const extension = this.nameFile.split('.').pop();
    this.extensionFile = extension
    const size = file.size / 1024 / 1024;
    const maxSize = 10;

    if (this.form.controls['id_partenaire'].value) {
      if (size > maxSize) {
        this.showMessageWarning('Il faut insérer une image avec une taille inférieure à ' + maxSize + ' MB')
      } else {
        if (extension == 'png' || extension == 'jpeg' ||
          extension == 'jpg' || extension == 'pdf' ||
          extension == 'doc' || extension == 'docx') {
          this.selectedFiles = {
            data: file,
            inProgress: false,
            progress: 0,
          }
          this.saveImage(this.selectedFiles)

          let reader = new FileReader();
          reader.onload = (e: any) => {
            this.localUrl = e.target.result;
          };
          reader.readAsDataURL(file);

        } else {
          this.showMessageWarning("Il faut télécharger une image .png ou .jpeg ou .jpg ou .pdf ou .doc ou .docx")
        }
      }
    } else {
      this.showMessageWarning("Veuillez choisir un compte")
    }

  }

  removePhoto() {
    this.localUrl = ''
    this.imgUpload = ''
    this.selectedFiles = ''
    this.extensionFile = ''
    this.form.get('id_document').setValue(null);
  }

  saveImage(photo) {
    const formdata = new FormData();
    formdata.append('document', photo.data);
    photo.inProgress = true;
    this.businessCaseService
      .uploadImage('PART',
        this.form.controls['id_partenaire'].value,
        this.extensionFile,
        formdata
      ).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          // case HttpEventType.Sent:
          //   console.log('Request has been made!');
          //   break;
          // case HttpEventType.ResponseHeader:
          //   console.log('Response header has been received!');
          //   break;
          case HttpEventType.UploadProgress:
            photo.progress = Math.round(event.loaded / event.total * 99);
            break;
          case HttpEventType.Response:
            photo.progress = 100
            this.imgUpload = event.body.url_document;
            this.form.get('id_document').setValue(event.body.id_document);
            break;
        }
      }),
      (err) => {
        photo.inProgress = false;
        if (err.status != 401) this.showMessageError();
      };
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
