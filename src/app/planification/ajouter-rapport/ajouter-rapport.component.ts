import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import { VisiteService } from 'app/service/visite-service/visite.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { PlanificationService } from 'app/service/planification-service/planification.service';
import { CurrentUserService } from 'app/service/current-user.service';
import { ParamsAppService } from 'app/service/params-app-service/params-app.service';

@Component({
  selector: 'ms-ajouter-rapport',
  templateUrl: './ajouter-rapport.component.html',
  styleUrls: ['./ajouter-rapport.component.scss']
})
export class AjouterRapportComponent implements OnInit {
  itemRapport: any = {};
  userItem: any = {};
  isSubmitted: boolean = false;
  form: FormGroup;
  listeFeedbacks = [];
  listeEtablissements = [];
  listeGammesProduits = [];
  listeUtilisateurs = []
  produits = [];
  mediafxFlex = 43
  date_jour = moment(new Date()).format('YYYY-MM-DD');
  minDate = moment(new Date()).format('YYYY-MM-DD');
  listHours = [];
  hoursRangeStart = 0;
  hoursRangeEnd = 23;
  constructor(
    public dialogRef: MatDialogRef<AjouterRapportComponent>,
    private formBuilder: FormBuilder,
    private planificationService: PlanificationService,
    private listeCodifService: ListeCodifService,
    private _currentUser: CurrentUserService,
    private paramsAppService: ParamsAppService,
  ) { }

  ngOnInit(): void {
    // this.get_hours_range();
    this.get_app_params();
    this.getInfos()
    this.initForm();
    this.selectPartenaire()
    this.getFeedbacks();
    this.getUtilisateursAccompagnants()
  }

  get_app_params() {
    this.paramsAppService.get().then((params: any) => {

      this.hoursRangeStart = Number(params["HEVI"]["HRSTART"]);
      this.hoursRangeEnd = Number(params["HEVI"]["HREND"]);
      this.initHours();

    });
  }

  // get_hours_range() {
  //   this.listeCodifService.get_hours_range()
  //     .subscribe((res: any) => {
  //       this.hoursRangeStart = Number(res["HRSTART"].libelle_codification);
  //       this.hoursRangeEnd = Number(res["HREND"].libelle_codification);
  //       this.initHours();
  //     });
  // }
  initHours() {
    for (let i = this.hoursRangeStart; i < this.hoursRangeEnd; i++) {
      if (String(i).length == 1) {
        this.listHours.push(`0${i}:00`);
        this.listHours.push(`0${i}:30`);
      }
      else {
        this.listHours.push(`${i}:00`);
        this.listHours.push(`${i}:30`);
      }
    }
  }
  getInfos() {
    this._currentUser.getInfos()
      .subscribe((res: any) => {
        this.date_jour = moment(res.date_jour).format('YYYY-MM-DD');
        this.minDate = this.date_jour;
      }, err => {
      })
  }
  initForm() {
    this.form = this.formBuilder.group({
      id_visiteur: [null],
      code_potentiel: [null],
      code_statut_visite: [null],
      commentaire: [null],
      date_replanification: [null],
      flag_accompagnee: [null],
      time_replanification: [null],
      time_fin_visite: [moment(this.itemRapport.heure_fin_visite, "HH:mm:ss").format('HH:mm')],
      time_visite: [moment(this.itemRapport.date_visite).format('HH:mm')],
    });
  }

  addLineProduits() {
    if (this.listeGammesProduits.length)
      this.produits.push({
        gamme: null, searchGamme: null,
        listeGammes: this.listeGammesProduits, filtereGammes: this.listeGammesProduits,
        produit: null, searchProduit: null,
        listeProduits: [], filtereProduits: [], feedback: null
      });
  }

  removeLine(index) {
    this.produits.splice(index, 1);
  }

  save() {
    this.isSubmitted = true;
    const saveproduits = [];

    this.produits.forEach((value, key) => {
      if (value.gamme || value.produit) saveproduits.push(value);
      else saveproduits.splice(key, 1);
    });

    var date_replanification = moment(this.form.controls['date_replanification'].value)

    let startTime = this.itemRapport.date_visite;
    let endTime = moment(this.itemRapport.date_visite).format("YYYY-MM-DD") + " " + this.form.controls['time_fin_visite'].value;
    if (
      moment(endTime)
        .isBefore(
          moment(startTime)
        )
    ) {
      Swal.fire({
        icon: "warning",
        text: `Heure fin visite est invalide !`,
        showConfirmButton: false,
        heightAuto: false,
        timer: 2500,
      });
      return;
    }

    setTimeout(() => {
      if (this.isSubmitted == true && this.form.valid && (this.form.controls['code_statut_visite'].value == 'REAL' ? this.isLineProduitValid(saveproduits) : true)) {
        if (date_replanification.diff(moment(this.date_jour), 'days', true) < 0 && this.form.controls['code_statut_visite'].value == 'REPL') {
          this.showMessageWarning("Veuillez choisir une date supérieure ou égale à la date d'aujourd'hui !")
        } else {
          Swal.fire({
            title: 'Opération est en cours!',
            heightAuto: false,
            didOpen: () => {
              Swal.showLoading(null);
            },
          });

          let date_replanification = `${this.form.controls['date_replanification'].value} ${this.form.controls['time_replanification'].value}`;
          let heure_fin_visite;
          let date_visite;
          if (this.form.controls['code_statut_visite'].value != "REPL") {
            heure_fin_visite = this.form.controls['time_fin_visite'].value + ":00";
            date_visite = `${moment(this.itemRapport.date_visite).format("YYYY-MM-DD")} ${this.form.controls['time_visite'].value}:00`;
          }
          else {
            heure_fin_visite = moment(date_replanification).add("minutes", 30).format("HH:mm:ss");
            date_visite = null;
          }
          const body = {
            id_visite: this.itemRapport.id_visite,
            // id_planification: this.itemRapport.id_planification,
            id_partenaire: this.itemRapport.id_partenaire,
            // code_potentiel: this.form.controls['code_potentiel'].value,
            code_statut_visite: this.form.controls['code_statut_visite'].value,
            commentaire: this.form.controls['commentaire'].value,
            date_replanification,
            flag_accompagnee: this.form.controls['flag_accompagnee'].value ? 'O' : 'N',
            id_accompagnant: this.form.controls['id_visiteur'].value,
            produits: [
              ...saveproduits.map((el) => [el.produit, el.gamme, el.feedback]),
            ],
            heure_fin_visite,
            date_visite,
          };
          this.planificationService.ajouterRapports(body).subscribe(
            (success) => {
              if (success?.duplicate) {
                this.showMessageWarning("La planification existe déjà pour cette semaine")
              } else {
                this.showMessageSuc(`Votre rapport a été ajouté avec succès`);
              }
            },
            (err) => {
              if (err.status == 409) {
                Swal.fire({
                  icon: "warning",
                  // text: `L'heure choisie (${this.form.controls['time_replanification'].value}) est occupé par une autre planification !`,
                  text: `La période choisie est occupé. Consultez votre agenda pour vérifier`,
                  showConfirmButton: false,
                  heightAuto: false,
                  timer: 2500,
                });
              }
              else {
                this.showMessageError();
              }
            }
          );
        }
      }
    }, 100);

  }

  isLineProduitValid(produit?) {
    var valid = true;
    produit.forEach((el) => {
      if (!el.gamme || !el.produit) valid = false;
    });
    if (produit.length == 0) valid = false;
    return valid;
  }

  selectPartenaire() {
    this.getGammesProduits(this.itemRapport.code_specialite);
    this.form.get('code_potentiel').setValue(this.itemRapport.code_potentiel);
    if (this.itemRapport.code_type_partenaire == 'MEDE') {
      this.mediafxFlex = 29
    } else {
      this.mediafxFlex = 43
    }
  }

  onChangeStatutVisite() {
    if (this.form.controls['code_statut_visite'].value == 'REPL') {
      this.form.get('flag_accompagnee').setValue(null);
      this.form.get('id_visiteur').setValue(null);
    }
    if (this.form.controls['code_statut_visite'].value == 'REAL' && this.produits.length == 0) {
      this.addLineProduits();
    } else if (this.form.controls['code_statut_visite'].value != 'REAL') {
      this.produits = []
    }
  }

  accompagneeVisite() {
    this.form.get('id_visiteur').setValue(null);
  }

  getUtilisateursAccompagnants() {
    this.listeCodifService.getUtilisateursAccompagnants()
      .subscribe((res: any) => {
        const utilisateurs = res.accompagnants.map(item => {
          return {
            role: item.role,
            code_codification: item.id_utilisateur,
            libelle_codification: item.nom_utilisateur,
          }
        });
        this.listeUtilisateurs = utilisateurs;
      }, err => {
        // this.showMessageError();
      })
  }

  getGammesProduits(code_specialite) {
    const body = {
      "code_specialite": code_specialite
    }
    this.listeCodifService.getGammesProduits(body).subscribe(
      (res: any) => {
        this.listeGammesProduits = res.gammes;
        this.produits = []
        this.addLineProduits();
      },
      (err) => {
        // this.showMessageError();
      }
    );
  }

  getFeedbacks() {
    this.listeCodifService.getFeedbacks().subscribe(
      (res: any) => {
        this.listeFeedbacks = res.feedbacks;
      },
      (err) => {
        // this.showMessageError();
      }
    );
  }

  filterItemGamme(index, clear) {
    const value = clear ? '' : this.produits[index].searchGamme
    this.produits[index].filtereGammes = this.produits[index].listeGammes.filter(
      item => item.libelle_codification.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }

  filterItemProduit(index, clear) {
    const value = clear ? '' : this.produits[index].searchProduit
    this.produits[index].filtereProduits = this.produits[index].listeProduits.filter(
      item => item.libelle_produit.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }

  selectGamme(item, index) {
    this.produits[index].filtereProduits = item.produits ? item.produits : []
    this.produits[index].listeProduits = this.produits[index].filtereProduits
    this.produits[index].produit = null
    this.produits[index].feedback = null
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
