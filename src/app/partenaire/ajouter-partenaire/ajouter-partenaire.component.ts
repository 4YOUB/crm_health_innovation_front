import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CurrentUserService } from 'app/service/current-user.service';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import { PartenaireService } from 'app/service/partenaire-service/partenaire.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'ms-ajouter-partenaire',
  templateUrl: './ajouter-partenaire.component.html',
  styleUrls: ['./ajouter-partenaire.component.scss']
})
export class AjouterPartenaireComponent implements OnInit {
  userItem
  isSubmitted: boolean = false;
  form: FormGroup;
  listeRevis = []
  listeVilles = []
  listeSecteurs = []
  listeEtablissements = []
  listeSpecialites = []
  itemPartenaire
  idPartenaire
  mode
  title = 'Ajouter Compte';
  constructor(public dialogRef: MatDialogRef<AjouterPartenaireComponent>,
    private formBuilder: FormBuilder,
    private partenaireService: PartenaireService,
    private listeCodifService: ListeCodifService) { }

  ngOnInit(): void {
    this.getEtablissements()
    this.getSpecialites()
    this.getRevis()
    if (this.idPartenaire && this.mode == 'modifier') {
      this.title = 'Modifier Compte';
      this.initForm(this.itemPartenaire);
    } else {
      this.initForm();
    }
  }
  initForm(data?) {
    this.form = this.formBuilder.group({
      type_partenaire: [{
        value: data ? data.code_type_partenaire : (this.userItem.flag_medical == 'O' && this.userItem.flag_pharmaceutique == 'N' ? 'MEDE' : this.userItem.flag_medical == 'N' && this.userItem.flag_pharmaceutique == 'O' ? 'PHAR' : null),
        disabled: this.idPartenaire ? true : (this.userItem.flag_medical != this.userItem.flag_pharmaceutique ? true : false)
      }],
      nom_partenaire: [data ? data.nom_partenaire : null],
      prenom_partenaire: [data ? data.prenom_partenaire : null],
      date_naissance: [data ? data.date_naissance : null],
      code_type_etablissement: [data ? data.code_type_etablissement : null],
      code_potentiel: [data ? data.code_potentiel : null],
      code_specialite: [data ? data.code_specialite : null],
      email_partenaire: [data ? data.email_partenaire : null],
      tel1_partenaire: [data ? data.tel1_partenaire : null, [Validators.pattern(/^[0][5-8][0-9]{8}$/), Validators.minLength(9)]],
      tel2_partenaire: [data ? data.tel2_partenaire : null, [Validators.pattern(/^[0][5-8][0-9]{8}$/), Validators.minLength(9)]],
      adresse_partenaire: [data ? data.adresse_partenaire : null],
      code_region: [data ? data.code_region_partenaire : null],
      code_ville: [{ value: data ? data.code_ville_partenaire : null, disabled: true }],
      code_secteur: [{ value: data ? data.code_secteur_partenaire : null, disabled: true }],
      code_statut_partenaire: [data ? data.code_statut_partenaire : null],
    });
    // if(this.idPartenaire)
    // this.form.get('type_partenaire').disable();
    if (!this.idPartenaire)
      this.onChangeTypePartenaire()
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
          id_partenaire: this.idPartenaire ? this.idPartenaire : null,
          type_partenaire: this.form.controls['type_partenaire'].value,
          nom_partenaire: this.form.controls['nom_partenaire'].value,
          prenom_partenaire: this.form.controls['prenom_partenaire'].value,
          date_naissance: this.form.controls['date_naissance'].value,
          code_type_etablissement: this.form.controls['code_type_etablissement'].value,
          code_potentiel: this.form.controls['code_potentiel'].value,
          code_specialite: this.form.controls['code_specialite'].value,
          email_partenaire: this.form.controls['email_partenaire'].value,
          tel1_partenaire: this.form.controls['tel1_partenaire'].value,
          tel2_partenaire: this.form.controls['tel2_partenaire'].value,
          adresse_partenaire: this.form.controls['adresse_partenaire'].value,
          code_region: this.form.controls['code_region'].value,
          code_ville: this.form.controls['code_ville'].value,
          code_secteur: this.form.controls['code_secteur'].value,
          code_statut_partenaire: this.userItem.role != 'ADMI' ? 'CREE' : this.form.controls['code_statut_partenaire'].value,
        };

        if (this.mode == 'modifier') {
          this.partenaireService.modifierPartenaire(body).subscribe(success => {
            this.showMessageSuc(`Votre compte a été modifié avec succès`);
          }, error => {
            this.showMessageError();
          })
        }
        else {
          this.partenaireService.ajouterPartenaire(body).subscribe(success => {
            if (success?.duplicate) {
              Swal.fire({
                icon: 'warning',
                text: `Nom compte en double`,
                showConfirmButton: false,
                heightAuto: false,
                timer: 2500
              });
            } else {
              this.showMessageSuc(`Votre compte a été ajouté avec succès`);
            }
          }, error => {
            this.showMessageError();
          })
        }
      }
    }, 100);
  }

  onChangeTypePartenaire() {
    if (this.form.controls['type_partenaire'].value == 'PHAR') {
      this.form.get('date_naissance').setValue(null);
      this.form.get('code_specialite').setValue(null);
      this.form.get('code_type_etablissement').setValue(null);
    }
  }

  getEtablissements() {
    this.listeCodifService.getEtablissement()
      .subscribe((res: any) => {
        this.listeEtablissements = res.etablissements;
      }, err => {
        // this.showMessageError();
      })
  }

  getSpecialites() {
    this.listeCodifService.getSpecialites()
      .subscribe((res: any) => {
        this.listeSpecialites = res.specialites;
      }, err => {
        // this.showMessageError();
      })
  }

  getRevis() {
    this.listeCodifService.getRevis().subscribe(
      (res: any) => {
        this.listeRevis = res.regions;
      },
      (err) => {
        // this.showMessageError();
      }
    );
  }

  selectVilleModif(item) {
    this.selectVille(item, true)
  }

  selectSecteurModif(item) {
    this.selectSecteur(item, true)
  }

  selectVille(item, mode?) {
    this.listeVilles = item.villes ? item.villes : [];
    this.listeSecteurs = [];
    this.form.get('code_ville').setValue(this.itemPartenaire && mode ? this.itemPartenaire.code_ville_partenaire : null);
    this.form.get('code_secteur').setValue(this.itemPartenaire && mode ? this.itemPartenaire.code_secteur_partenaire : null);

    if (this.listeVilles?.length == 0 || !this.listeVilles) {
      this.form.get('code_ville').disable();
      this.form.get('code_secteur').disable();
    } else {
      this.form.get('code_ville').enable();
      this.form.get('code_secteur').enable();
    }
  }

  selectSecteur(item, mode?) {
    this.listeSecteurs = item.secteurs ? item.secteurs : [];
    this.form.get('code_secteur').setValue(this.itemPartenaire && mode ? this.itemPartenaire.code_secteur_partenaire : null);

    if (this.listeSecteurs?.length == 0 || !this.listeSecteurs) {
      this.form.get('code_secteur').disable();
    } else {
      this.form.get('code_secteur').enable();
    }
  }

  showMessageSuc(msg) {
    Swal.fire({
      icon: 'success',
      title: msg,
      text: "Votre activité sera vérifiée par l'administrateur !",
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
