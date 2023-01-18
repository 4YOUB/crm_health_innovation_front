import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BusinessCaseService } from 'app/service/business-case-service/business-case.service';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import Swal from 'sweetalert2';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ThemeService } from 'ng2-charts';

@Component({
  selector: 'ms-ajouter-business-case',
  templateUrl: './ajouter-business-case.component.html',
  styleUrls: ['./ajouter-business-case.component.scss']
})
export class AjouterBusinessCaseComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport)
  cdkVirtualScrollViewPort: CdkVirtualScrollViewport;

  userItem
  isSubmitted: boolean = false;
  form: FormGroup;
  listeRevis = []
  listeVilles = []
  listeSecteurs = []
  listePartenaires = []
  listeTypeInvestissement = []
  filterelistePartenaires = []
  imgUpload
  localUrl: any;
  selectedFiles
  id_investissement: string;
  mode: string;
  title: string = 'Ajouter Investissement';
  isLoading = false
  investissement: any;
  id_partenaire: any;
  itemSelectPartenaire: any;
  extensionFile
  nameFile;
  url_document = null
  id_document
  constructor(public dialogRef: MatDialogRef<AjouterBusinessCaseComponent>,
    private formBuilder: FormBuilder,
    private businessCaseService: BusinessCaseService,
    private listeCodifService: ListeCodifService) { }

  ngOnInit(): void {
    if (this.id_investissement && this.mode == 'modifier') {
      this.title = 'Modifier Investissement';
      this.getInvestissement();
    } else {
      this.initForm()
      this.getPartenaire()
      this.getTypeInvestissement()
    }
  }
  getInvestissement() {
    this.isLoading = true;
    this.businessCaseService.getFicheBusinessCase(this.id_investissement)
      .subscribe((res: any) => {
        this.investissement = res.business_case;
        if (this.investissement.id_document) {
          this.imgUpload = this.investissement.url_document
          this.id_document = this.investissement.id_document
          this.nameFile = this.investissement.intitule_document
          this.extensionFile = this.investissement.extension_document;
          this.selectedFiles = {
            data: '',
            inProgress: true,
            progress: 100,
          }
        }
        this.getPartenaire();
        this.getTypeInvestissement()
        this.initForm(this.investissement);
        this.isLoading = false;
      }, err => {
        // this.showMessageError();
      })
  }

  onChangeTypeInvestissement() {
    if (this.form.controls['code_type_investissement'].value == 'IN0001') {
      this.form.get('objet_investissement').setValue(null);
    }
    if (this.form.controls['code_type_investissement'].value != 'IN0002') {
      this.form.get('budget').setValue(null);
      this.form.get('nom_beneficiaire').setValue(null);
      this.form.get('rib_beneficiaire').setValue(null);
    }
    if (this.form.controls['code_type_investissement'].value != 'IN0003') {
      this.form.get('destination').setValue(null);
    }
  }

  initForm(data?) {
    this.form = this.formBuilder.group({

      id_partenaire: [this.id_partenaire ? this.id_partenaire : null],
      nom_beneficiaire: [data ? data.nom_beneficiaire : null],
      rib_beneficiaire: [data ? data.rib_beneficiaire : null],
      code_type_investissement: [data ? data.code_type_investissement : null],
      objet_investissement: [data ? data.objet_investissement : null],
      budget: [data ? data.budget : null],
      destination: [data ? data.destination : null],
      description: [data ? data.description : null],
      id_document: [data ? data.id_document : null],
      nom_document: [data ? data.nom_document : null],
    });
  }

  save() {
    this.isSubmitted = true
    setTimeout(() => {
      if (this.isSubmitted == true && this.form.valid) {
        if (!this.form.controls['id_document'].value && this.localUrl) {
          this.showMessageWarning("Veuillez patientez quelques instants,, nous chargeons votre document")
        } else {
          Swal.fire({
            title: "Opération est en cours!",
            heightAuto: false,
            didOpen: () => {
              Swal.showLoading(null);
            }
          });
          const body = this.form.value
          body['id_business_case'] = this.id_investissement;
          if (this.mode == 'modifier') {
            this.businessCaseService.modifierBusinessCase(body).subscribe(success => {
              this.showMessageSuc(`Votre investissement a été modifié avec succès`);
            }, error => {
              this.showMessageError();
            })
          }
          else {
            this.businessCaseService.ajouterBusinessCase(body).subscribe(success => {
              this.showMessageSuc(`Votre investissement a été ajouté avec succès`);
            }, error => {
              this.showMessageError();
            })
          }
        }
      }
    }, 100);
  }

  openChange($event: boolean) {
    if ($event) {
      this.cdkVirtualScrollViewPort.scrollToIndex(0);
      this.cdkVirtualScrollViewPort.checkViewportSize();
    }
    this.removePhoto()
  }

  getTypeInvestissement() {
    const body = {
      "type_codification": 'TYIN',
      "code_codification": null,
      "type_parent": null,
      "code_parent": null
    }
    this.listeCodifService.getCodification(body)
      .subscribe((res: any) => {
        this.listeTypeInvestissement = res.codification;
      }, err => {
        // this.showMessageError();
      })
  }

  getPartenaire() {
    this.listeCodifService.getListePartenaire('MEDE')
      .subscribe((res: any) => {
        this.listePartenaires = res.partenaires;
        this.filterelistePartenaires = this.listePartenaires
        if (this.id_partenaire) {
          const item = this.listePartenaires.filter(
            item => item.id_partenaire == this.id_partenaire
          )[0];

          this.form.get('id_partenaire').setValue(item.id_partenaire);
          this.selectPartenaire(item)
        }
      }, err => {
        // this.showMessageError();
      })
  }

  selectPartenaire(item) {
    this.itemSelectPartenaire = item
  }

  filterPartenaires(value) {
    this.filterelistePartenaires = this.listePartenaires.filter(
      item => item.nom_partenaire.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }

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

  removePhoto(event?) {
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
      .uploadImage('BC',
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
