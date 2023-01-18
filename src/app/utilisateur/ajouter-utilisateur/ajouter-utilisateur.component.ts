import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import { UtilisateurService } from 'app/service/utilisateur-service/utilisateur.service';
import Swal from 'sweetalert2';
import { MustMatch } from './must-match.validator';

@Component({
  selector: 'ms-ajouter-utilisateur',
  templateUrl: './ajouter-utilisateur.component.html',
  styleUrls: ['./ajouter-utilisateur.component.scss']
})
export class AjouterUtilisateurComponent implements OnInit {
  userItem: any = {};
  id_utilisateur
  mode;
  title = 'Ajouter Utilisateur';
  isLoading = false
  isSubmitted: boolean = false;
  form: FormGroup;
  roles = ['ADMI', 'DIR', 'PM', 'DRG', 'DSM', 'KAM', 'DEL', 'ACH']
  roleMulti = ['DRG', 'DSM', 'KAM', 'DEL']
  itemUtilisateur: any = {};
  listeRevis = []
  listeGammes = []
  listeResponsables = []
  hide = true;
  listPermissions = [
    {
      name: "Export",
      controlName: "flag_export",
      subPerms: [
        {
          name: "Liste comptes",
          controlName: "export_comptes"
        },
        {
          name: "Liste planification",
          controlName: "export_planifications"
        },
        {
          name: "Liste visites",
          controlName: "export_visites"
        },
        {
          name: "Liste investissements",
          controlName: "export_investissements"
        },
        {
          name: "Rapports planification",
          controlName: "export_rapports_planification"
        },
        {
          name: "Liste événements",
          controlName: "export_evenement"
        },
        {
          name: "Rapports de visite",
          controlName: "export_rapport_visite"
        },
        {
          name: "Taux de couverture",
          controlName: "export_taux_couverture"
        },
        {
          name: "Liste délégues",
          controlName: "export_delegues"
        },
        {
          name: "Liste utilisateurs",
          controlName: "export_utilisateurs"
        }
      ]
    },
    {
      name: "Reporting",
      controlName: "flag_reporting",
      subPerms: [
        {
          name: "Rapport de visite et planification",
          controlName: "reporting_visite_planification"
        },
        {
          name: "Taux de couverture et fréquence de couverture",
          controlName: "reporting_taux_freq_couverture"
        },
      ]
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<AjouterUtilisateurComponent>,
    private formBuilder: FormBuilder,
    private utilisateurService: UtilisateurService,
    private listeCodifService: ListeCodifService,

  ) { }

  ngOnInit(): void {
    this.getRevis()
    this.getGammes()

    if (this.id_utilisateur && this.mode == 'modifier') {
      this.title = 'Modifier Utilisateur';
      this.initForm(this.itemUtilisateur);
    } else {
      this.initForm();
    }
  }

  initForm(data?) {
    this.form = this.formBuilder.group({
      id_utilisateur: [data ? data.id_utilisateur : null],
      nom_utilisateur: [data ? data.nom_utilisateur : null],
      prenom_utilisateur: [data ? data.prenom_utilisateur : null],
      role: [data ? data.role : null],
      login: [data ? data.login : null],
      email: [data ? data.email : null],
      telephone: [data ? data.telephone : null],
      flag_pharmaceutique: [data ? data.flag_pharmaceutique == 'O' ? true : false : null],
      flag_medical: [data ? data.flag_medical == 'O' ? true : false : null],
      gammes: [data ? [
        ...data.gammes.map((el) => el.code_gamme),
      ] : null],
      regions: [data ? [
        ...data.regions.map((el) => el.code_region),
      ] : null],
      id_responsable: [data ? data.id_responsable : null],
      flag_password: [data ? null : true],
      password: [null],
      passwordConfirm: [null],
      flag_export: [data ? data.flag_export == 'O' ? true : false : false],
      flag_reporting: [data ? data.flag_reporting == 'O' ? true : false : false],
      export_comptes: [data ? data.export_comptes == 'O' ? true : false : null],
      export_planifications: [data ? data.export_planifications == 'O' ? true : false : null],
      export_visites: [data ? data.export_visites == 'O' ? true : false : null],
      export_investissements: [data ? data.export_investissements == 'O' ? true : false : null],
      export_rapports_planification: [data ? data.export_rapports_planification == 'O' ? true : false : null],
      export_evenement: [data ? data.export_evenement == 'O' ? true : false : null],
      export_rapport_visite: [data ? data.export_rapport_visite == 'O' ? true : false : null],
      export_taux_couverture: [data ? data.export_taux_couverture == 'O' ? true : false : null],
      export_delegues: [data ? data.export_delegues == 'O' ? true : false : null],
      export_utilisateurs: [data ? data.export_utilisateurs == 'O' ? true : false : null],
      reporting_visite_planification: [data ? data.reporting_visite_planification == 'O' ? true : false : null],
      reporting_taux_freq_couverture: [data ? data.reporting_taux_freq_couverture == 'O' ? true : false : null]
    });
    if (data?.role == 'ADMI' || data?.role == 'DIR') {
      this.form.get('role').disable();
    }
    this.onChangeRole()
    this.onChangeGetResponsable()

  }

  onPermissionChange() {

  }

  show_rules_mdp = false
  markAllAsTouched() {
    this.show_rules_mdp = true
  }

  caseCharacters(value) {
    let CaseCharacters = /[A-Za-z]+/g
    return value ? CaseCharacters.test(value) : false;
  }

  numberCharacters(value) {
    let numberCharacters = /[0-9]+/g
    return value ? numberCharacters.test(value) : false;
  }
  onChangeRole() {
    const role = this.form.controls['role'].value
    if (!this.roleMulti.includes(role)) {
      this.form.get('gammes').setValue(null);
      this.form.get('regions').setValue(null);
    }

    const rolesFlag = ['ADMI', 'DIR', 'PM']
    if (rolesFlag.includes(role)) {
      this.form.get('flag_pharmaceutique').setValue(true);
      this.form.get('flag_medical').setValue(true);
      this.form.get('flag_pharmaceutique').disable();
      this.form.get('flag_medical').disable();
    } else {
      this.form.get('flag_pharmaceutique').setValue(this.itemUtilisateur ? this.itemUtilisateur.flag_pharmaceutique == 'O' ? true : false : null);
      this.form.get('flag_medical').setValue(this.itemUtilisateur ? this.itemUtilisateur.flag_medical == 'O' ? true : false : null);
      this.form.get('flag_pharmaceutique').enable();
      this.form.get('flag_medical').enable();
    }

    if (role == 'ACH') {
      this.form.get('flag_pharmaceutique').setValue(null);
      this.form.get('flag_medical').setValue(true);
      this.form.get('flag_pharmaceutique').disable();
      this.form.get('flag_medical').disable();
    }

    this.gammesMedical = false
    this.form.get('id_responsable').setValue(null);
    if (role)
      this.onChangeGetResponsable()
  }
  gammesMedical = false
  gammesRegions = false

  onChangeGetResponsable() {
    if (this.form.controls['flag_medical'].value) {
      this.gammesMedical = true
    } else {
      this.gammesMedical = false
      this.form.get('gammes').setValue(null);
    }

    this.form.get('id_responsable').setValue(null);

    const body = {
      "role": this.form.controls['role'].value,
      "flag_medical": this.form.controls['flag_medical'].value ? 'O' : 'N',
      "gammes": this.form.controls['gammes'].value?.length ? this.form.controls['gammes'].value : null,
      "regions": this.form.controls['regions'].value?.length ? this.form.controls['regions'].value : null,
      "id_utilisateur": this.itemUtilisateur.id_utilisateur
    }

    this.utilisateurService.getResponsable(body)
      .subscribe((res: any) => {
        this.gammesRegions = true
        this.listeResponsables = res.utilisateurs;
        this.form.get('id_responsable').setValue(this.itemUtilisateur ? this.itemUtilisateur.id_responsable : null);
      }, err => {
        // this.showMessageError();
        this.form.get('id_responsable').setValue(null);
        this.isLoading = false;
      })

  }
  formValidators(value) {
    if (value.flag_password)
      this.form = this.formBuilder.group({
        id_utilisateur: [value.id_utilisateur],
        nom_utilisateur: [value.nom_utilisateur],
        prenom_utilisateur: [value.prenom_utilisateur],
        role: [value.role],
        login: [value.login],
        email: [value.email, [Validators.email]],
        telephone: [value.telephone],
        flag_pharmaceutique: [value.flag_pharmaceutique],
        flag_medical: [value.flag_medical],
        gammes: [value.gammes],
        regions: [value.regions],
        id_responsable: [value.id_responsable],
        flag_password: [value.flag_password],
        password: [value.password, [Validators.minLength(8)]],
        passwordConfirm: [value.passwordConfirm],
        flag_export: [value.flag_export],
        flag_reporting: [value.flag_reporting],
        export_comptes: [value.export_comptes],
        export_planifications: [value.export_planifications],
        export_visites: [value.export_visites],
        export_investissements: [value.export_investissements],
        export_rapports_planification: [value.export_rapports_planification],
        export_evenement: [value.export_evenement],
        export_rapport_visite: [value.export_rapport_visite],
        export_taux_couverture: [value.export_taux_couverture],
        export_delegues: [value.export_delegues],
        export_utilisateurs: [value.export_utilisateurs],
        reporting_visite_planification: [value.reporting_visite_planification],
        reporting_taux_freq_couverture: [value.reporting_taux_freq_couverture],
      }, {
        validator: MustMatch('password', 'passwordConfirm')
      });
    else
      this.form = this.formBuilder.group({
        id_utilisateur: [value.id_utilisateur],
        nom_utilisateur: [value.nom_utilisateur],
        prenom_utilisateur: [value.prenom_utilisateur],
        role: [value.role],
        login: [value.login],
        email: [value.email, [Validators.email]],
        telephone: [value.telephone],
        flag_pharmaceutique: [value.flag_pharmaceutique],
        flag_medical: [value.flag_medical],
        gammes: [value.gammes],
        regions: [value.regions],
        id_responsable: [value.id_responsable],
        flag_password: [value.flag_password],
        password: [value.password],
        passwordConfirm: [value.passwordConfirm],
        flag_export: [value.flag_export],
        flag_reporting: [value.flag_reporting],
        export_comptes: [value.export_comptes],
        export_planifications: [value.export_planifications],
        export_visites: [value.export_visites],
        export_investissements: [value.export_investissements],
        export_rapports_planification: [value.export_rapports_planification],
        export_evenement: [value.export_evenement],
        export_rapport_visite: [value.export_rapport_visite],
        export_taux_couverture: [value.export_taux_couverture],
        export_delegues: [value.export_delegues],
        export_utilisateurs: [value.export_utilisateurs],
        reporting_visite_planification: [value.reporting_visite_planification],
        reporting_taux_freq_couverture: [value.reporting_taux_freq_couverture],
      });
  }
  save(value) {
    this.isSubmitted = true;
    const role = this.form.controls['role'].value;
    this.formValidators(value);
    this.form.get('role').setValue(role);
    const rolesFlag = ['ADMI', 'DIR', 'PM']
    if (rolesFlag.includes(role)) {
      this.form.get('flag_pharmaceutique').setValue(true);
      this.form.get('flag_medical').setValue(true);
    }
    if (role == 'ACH') {
      this.form.get('flag_pharmaceutique').setValue(null);
      this.form.get('flag_medical').setValue(true);
    }

    setTimeout(() => {
      if (this.isSubmitted == true && this.form.valid && (this.form.get('flag_medical').value || this.form.get('flag_pharmaceutique').value)) {
        Swal.fire({
          title: 'Opération est en cours!',
          heightAuto: false,
          didOpen: () => {
            Swal.showLoading(null);
          },
        });
        const body = {
          id_utilisateur: this.id_utilisateur,
          nom_utilisateur: this.form.controls['nom_utilisateur'].value,
          prenom_utilisateur: this.form.controls['prenom_utilisateur'].value,
          role: this.form.controls['role'].value,
          login: this.form.controls['login'].value,
          password: value.flag_password ? this.form.controls['password'].value : null,
          email: this.form.controls['email'].value,
          telephone: this.form.controls['telephone'].value,
          flag_pharmaceutique: this.form.controls['flag_pharmaceutique'].value ? 'O' : 'N',
          flag_medical: this.form.controls['flag_medical'].value ? 'O' : 'N',
          gammes: this.form.controls['gammes'].value?.length ? this.form.controls['gammes'].value : null,
          regions: this.form.controls['regions'].value?.length ? this.form.controls['regions'].value : null,
          id_responsable: this.form.controls['id_responsable'].value,
          flag_export: this.form.controls['flag_export'].value ? 'O' : 'N',
          flag_reporting: this.form.controls['flag_reporting'].value ? 'O' : 'N',
          export_comptes: this.form.controls['export_comptes'].value ? 'O' : 'N',
          export_planifications: this.form.controls['export_planifications'].value ? 'O' : 'N',
          export_visites: this.form.controls['export_visites'].value ? 'O' : 'N',
          export_investissements: this.form.controls['export_investissements'].value ? 'O' : 'N',
          export_rapports_planification: this.form.controls['export_rapports_planification'].value ? 'O' : 'N',
          export_evenement: this.form.controls['export_evenement'].value ? 'O' : 'N',
          export_rapport_visite: this.form.controls['export_rapport_visite'].value ? 'O' : 'N',
          export_taux_couverture: this.form.controls['export_taux_couverture'].value ? 'O' : 'N',
          export_delegues: this.form.controls['export_delegues'].value ? 'O' : 'N',
          export_utilisateurs: this.form.controls['export_utilisateurs'].value ? 'O' : 'N',
          reporting_visite_planification: this.form.controls['reporting_visite_planification'].value ? 'O' : 'N',
          reporting_taux_freq_couverture: this.form.controls['reporting_taux_freq_couverture'].value ? 'O' : 'N',
        };
        if (this.mode == 'modifier') {
          this.utilisateurService.modifierUtilisateur(body).subscribe(
            (success) => {
              if (success?.duplicate) {
                this.showMessageWarning("Rôle existant pour les régions et/ou les gammes spécifiées !")
              } else {
                this.showMessageSuc(`Votre utilisateur a été modifié avec succès`);
              }
            },
            (error) => {
              this.showMessageError();
            }
          );
        }
        else {
          this.utilisateurService.ajouterUtilisateur(body).subscribe(
            (success) => {
              if (success?.duplicate) {
                this.showMessageWarning("Rôle existant pour les régions et/ou les gammes spécifiées !")
              } else {
                this.showMessageSuc(`Votre utilisateur a été ajouté avec succès`);
              }
            },
            (error) => {
              this.showMessageError();
            }
          );
        }
      }
    }, 100);

  }

  getRevis() {
    this.listeCodifService.getRevis()
      .subscribe((res: any) => {
        this.listeRevis = res.regions;
      }, err => {
        // this.showMessageError();
      })
  }

  getGammes() {
    this.listeCodifService.getGammes().subscribe(
      (res: any) => {
        this.listeGammes = res.gammes;
      },
      (err) => {
        // this.showMessageError();
      }
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
    this.dialogRef.close(true);
  }

  showMessageError() {
    Swal.fire({
      icon: 'error',
      title: `Une erreur est survenue`,
      text: 'Veuillez réessayer plus tard',
      showConfirmButton: false,
      heightAuto: false,
      timer: 2500,
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
