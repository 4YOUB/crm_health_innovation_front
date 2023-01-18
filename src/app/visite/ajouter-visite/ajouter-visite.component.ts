import { Component, OnInit, QueryList, ChangeDetectorRef, ViewChildren, ElementRef, AfterViewInit, AfterContentChecked, } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import { VisiteService } from 'app/service/visite-service/visite.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { CurrentUserService } from 'app/service/current-user.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ParamsAppService } from 'app/service/params-app-service/params-app.service';
import { PlanificationService } from 'app/service/planification-service/planification.service';

@Component({
  selector: 'ms-ajouter-visite',
  templateUrl: './ajouter-visite.component.html',
  styleUrls: ['./ajouter-visite.component.scss'],
})
export class AjouterVisiteComponent implements OnInit, AfterViewInit {
  @ViewChildren(CdkVirtualScrollViewport)
  cdkVirtualScrollViewPort: QueryList<CdkVirtualScrollViewport>;
  @ViewChildren('searchInput') searchInput: HTMLInputElement

  userItem: any = {};
  id_visite;
  id_planification
  mode;
  title = 'Ajouter Visite';
  isLoading = false
  idPartenaire = null
  isSubmitted: boolean = false;
  form: FormGroup;
  listePartenaires = []
  filterelistePartenaires = []
  listeFeedbacks = [];
  listeEtablissements = [];
  listeGammesProduits = [];
  itemSelectPartenaire;
  listeUtilisateurs = []
  produits = [];
  showNomRemplacent = false
  mediafxFlex = 30
  date_jour = moment(new Date()).format('YYYY-MM-DD')
  maxDate = moment(new Date()).format('YYYY-MM-DD');
  minDate = moment(new Date()).format('YYYY-MM-DD');
  tomorrow = moment(new Date()).add(1, 'd').format('YYYY-MM-DD')
  visite: any = {};
  statut_realisee = false;

  // nbrJoursFutur = 0;
  nbrJoursPass = 0;
  listHours = [];
  listHoursFinVisite = []
  hoursRangeStart = 0;
  hoursRangeEnd = 23;
  clickedCalendarDate
  typeVisite = "S"
  partenaires = []
  constructor(
    public dialogRef: MatDialogRef<AjouterVisiteComponent>,
    private formBuilder: FormBuilder,
    private visiteService: VisiteService,
    private listeCodifService: ListeCodifService,
    private _currentUser: CurrentUserService,
    private paramsAppService: ParamsAppService,
    private planificationService: PlanificationService
  ) { }

  ngOnInit(): void {
    this.getInfos()
    // this.get_app_params();
    // this.get_hours_range();
    // this.get_nbr_jours();
    if (this.id_visite && (this.mode == 'modifier' || this.mode == 'rapport')) {
      this.title = this.mode == 'modifier' ? 'Modifier Visite' : 'Ajouter rapport';
      this.getVisite();
    } else {
      this.partenaires = []
      this.initForm();
      this.getPartenaire();
      this.addLinePartenaire()
      this.getGammesProduits();
    }
    this.getFeedbacks();
    this.getUtilisateursAccompagnants()
    setTimeout(() => {
      this.tmpFix()
      // console.log(this.form.get('time_visite').value)
      this.listHoursFinVisite = this.listHoursFinVisite.filter((heure) => {
        if (moment(heure, 'HH:mm').isAfter(moment(this.form.get('time_visite').value, 'HH:mm'))) return true
      })
    }, 300);

  }
  ngAfterViewInit(): void {
    if (this.partenaires.length > 0 && this.filterelistePartenaires.length > 0) this.tmpFix()
  }
  get_app_params() {
    this.paramsAppService.get().then((params: any) => {

      this.hoursRangeStart = Number(params["HEVI"]["HRSTART"]);
      this.hoursRangeEnd = Number(params["HEVI"]["HREND"]);
      this.initHours();

      this.nbrJoursPass = Number(params["JOVI"]["JRPASSVI"]);
      this.minDate = moment(this.date_jour).subtract(this.nbrJoursPass, "days").format('YYYY-MM-DD');

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
    for (let i = this.hoursRangeStart; i <= this.hoursRangeEnd; i++) {
      if (String(i).length == 1) {
        this.listHours.push(`0${i}:00`);
        this.listHours.push(`0${i}:30`);
      }
      else {
        this.listHours.push(`${i}:00`);
        this.listHours.push(`${i}:30`);
      }
    }
    this.listHoursFinVisite = this.listHours

  }
  // get_nbr_jours() {
  //   this.listeCodifService.get_nbr_jours()
  //     .subscribe((res: any) => {
  //       // this.nbrJoursFutur = res["JRFUTUR"].libelle_codification;
  //       this.nbrJoursPass = res["JRPASS"].libelle_codification;
  //       this.minDate = moment(new Date()).subtract(this.nbrJoursPass, "days").format('YYYY-MM-DD');
  //     });
  // }
  getInfos() {
    this._currentUser.getInfos()
      .subscribe((res: any) => {
        this.date_jour = moment(res.date_jour).format('YYYY-MM-DD');
        this.maxDate = this.date_jour;
        this.minDate = this.date_jour;

        this.get_app_params();
      }, err => {
      })
  }
  initForm(data?) {
    let date = new Date();
    let time_visite;
    const reminder = 60 - (moment(date).minutes() % 60);
    time_visite = moment(date).add(reminder, "minutes").format("HH:mm");
    this.form = this.formBuilder.group({
      // id_partenaire: [this.idPartenaire ? this.idPartenaire : null],
      id_visiteur: [data ? data.id_accompagnant : null],
      code_potentiel: [null],
      date_visite: [
        {
          value: data ?
            moment(data.date_visite).format("YYYY-MM-DD") :
            this.clickedCalendarDate ? moment(this.clickedCalendarDate).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD"),
          disabled: this.id_visite ? this.visite.code_type_visite != 'HOPL' : false
        }
      ],
      code_statut_visite: [data ? data.code_statut_visite : 'REAL'],
      commentaire: [data ? data.commentaire : null],
      date_replanification: [data && moment(data.date_replanification).format("YYYY-MM-DD") != "Invalid date" ? moment(data.date_replanification).format("YYYY-MM-DD") : null],
      flag_accompagnee: [data ? data.flag_accompagnee == 'O' ? true : false : null],
      time_visite: [
        data ?
          moment(data.date_visite).format("HH:mm") :
          this.clickedCalendarDate ? moment(this.clickedCalendarDate).format("HH:mm") : time_visite,
      ],
      time_replanification: [data && moment(data.date_replanification).format("HH:mm") != "Invalid date" ? moment(data.date_replanification).format("HH:mm") : null],
      time_fin_visite: [
        data && moment(data.heure_fin_visite, "HH:mm:ss").format("HH:mm") != "Invalid date" ?
          moment(data.heure_fin_visite, "HH:mm:ss").format("HH:mm") :
          null,
      ],
      // nom_remplacent: [data?.nom_remplacent?data.nom_remplacent:null],
    });

  }

  statutChanged() {
    this.setHeureFinVisite(this.form.get('time_visite').value)
    if (this.form.get('code_statut_visite').value == 'ABSE') {
      this.partenaires.splice(1);
      this.typeVisite = 'S'
    }
    setTimeout(() => {
      this.tmpFix()
    }, 0)
  }

  openChange($event: boolean, index, id_partenaire) {
    this.searchInput.value = ''
    const cdkV = this.cdkVirtualScrollViewPort.find((_, i) => i == index)
    let parIndex = this.filterelistePartenaires[index].findIndex(par => par.id_partenaire === id_partenaire)
    parIndex = parIndex === -1 ? 0 : parIndex
    cdkV.scrollToIndex(parIndex);
    cdkV.setRenderedRange({ start: parIndex, end: parIndex + 10 })
  }
  addLineProduits() {
    if (this.listeGammesProduits.length)
      this.produits.push({
        gamme: null, searchGamme: null,
        listeGammes: this.listeGammesProduits, filtereGammes: this.listeGammesProduits,
        produit: null, searchProduit: null,
        listeProduits: [], filtereProduits: [], feedback: null,
        avecEchantillon: false, echantillon: 0
      });
  }

  addLinePartenaire() {
    this.partenaires.push({
      code_type_partenaire: null, id_partenaire: null,
      nom_remplacent: null, code_region_partenaire: null,
      code_gamme_partenaire: null
    });
    this.resetFilterPartenaires()
    setTimeout(() => {
      this.tmpFix()
    }, 0);
  }
  removePartenairesLine(index) {
    this.partenaires.splice(index, 1)
    this.resetFilterPartenaires()
    setTimeout(() => {
      this.tmpFix()
    }, 0);
  }

  removeLine(index) {
    this.produits.splice(index, 1);
  }

  toggleNomRemplacent(index) {
    this.partenaires[index].nom_remplacent = null
  }
  checkIfMedecin() {
    return this.partenaires.some(partenaire => partenaire.code_type_partenaire === 'MEDE')
  }
  save() {
    this.isSubmitted = true;
    const saveproduits = [];
    const savePartenaires = [];
    this.produits.forEach((value, key) => {
      if (value.echantillon < 0) {
        Swal.fire({
          icon: "warning",
          text: `Nombre d'Echantillon ne peut pas être négatif !`,
          showConfirmButton: false,
          heightAuto: false,
          timer: 2500,
        });
      }
      if (value.gamme || value.produit) saveproduits.push(value);
      else saveproduits.splice(key, 1);
    });

    this.partenaires.forEach((value, key) => {
      if (value.id_partenaire) savePartenaires.push(value)
    })


    if (this.form.controls['code_statut_visite'].value == 'ENAT' || this.form.controls['code_statut_visite'].value == 'REPL') {
      savePartenaires.splice(1);
      this.form.controls['id_visiteur'].setValue(null);
    }

    this.typeVisite = savePartenaires.length > 1 ? 'G' : 'S'

    var date_visite = moment(this.form.controls['date_visite'].value)
    var date_replanification = moment(this.form.controls['date_replanification'].value)

    if (
      moment(this.form.controls['time_fin_visite'].value, "HH:mm:ss")
        .isBefore(
          moment(this.form.controls['time_visite'].value, "HH:mm:ss")
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
    if (!this.form.get('time_visite').value || moment(this.form.get('time_visite').value, 'HH:mm').isBefore(moment().hours(this.hoursRangeStart).minutes(0))) {
      this.form.get('time_visite').setValue(null)
      return
    }
    setTimeout(() => {
      if (this.isSubmitted == true && this.form.valid && (this.form.controls['code_statut_visite'].value == 'REAL' ? this.isLineProduitValid(saveproduits) : true)) {
        if (date_visite.diff(moment(this.date_jour), 'days', true) <= 0) {
          if (date_replanification.diff(moment(this.date_jour), 'days', true) < 0 && this.form.controls['code_statut_visite'].value == 'REPL') {
            this.showMessageWarning("Veuillez choisir une date replanification supérieure ou égale à la date d'aujourd'hui !")
          } else {
            Swal.fire({
              title: 'Opération est en cours!',
              heightAuto: false,
              didOpen: () => {
                Swal.showLoading(null);
              },
            });
            const body = {
              id_visite: this.id_visite,
              // id_planification: this.id_planification,
              // code_potentiel: this.form.controls['code_potentiel'].value,
              partenaires: [
                ...savePartenaires.map(par => [par.id_partenaire, par.nom_remplacent, par.code_region_partenaire, par.code_type_partenaire, par.code_gamme_partenaire])
              ],
              code_statut_visite: this.form.controls['code_statut_visite'].value,
              date_visite: `${this.form.controls['date_visite'].value} ${this.form.controls['time_visite'].value}`,
              commentaire: this.form.controls['commentaire'].value,
              date_replanification: `${this.form.controls['date_replanification'].value} ${this.form.controls['time_replanification'].value}`,
              code_type_visite: this.visite ? this.visite.code_type_visite : null,
              flag_accompagnee: this.form.controls['flag_accompagnee'].value ? 'O' : 'N',
              id_accompagnant: this.form.controls['id_visiteur'].value,
              produits: [
                ...saveproduits.map((el) => [el.produit, el.gamme, el.feedback, el.echantillon]),
              ],
              heure_fin_visite: this.form.controls['time_fin_visite'].value,
              type_visite: this.typeVisite
            };
            if (this.mode == 'modifier') {
              this.visiteService.modifierVisite(body).subscribe(
                (success) => {
                  if (success?.duplicate) {
                    this.showMessageWarning("La visite existe déjà !")
                  } else {
                    this.showMessageSuc(`Votre visite a été modifiée avec succès`);
                  }
                },
                (err) => {
                  if (err.status == 409) {
                    let info = err.error;
                    let message;
                    let s = info.conflictCount > 1 ? "s" : "";
                    if (info.conflictSource == "evenement") {
                      message = `La date choisie est occupé par un évènement !`;
                      Swal.fire({
                        icon: "warning",
                        text: message,
                        showConfirmButton: false,
                        heightAuto: false,
                        timer: 2500,
                      });
                    } else if (info.conflictSource == "visite") {
                      message = `La date choisie est occupé par une visite !`;
                      Swal.fire({
                        icon: "warning",
                        text: message,
                        showConfirmButton: false,
                        heightAuto: false,
                        timer: 2500,
                      });
                    }
                  } else {
                    this.showMessageError();
                  }
                }
              );
            }
            else if (this.mode == 'rapport') {
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
            else {
              this.visiteService.ajouterVisite(body).subscribe(
                (success) => {
                  if (success?.duplicate) {
                    this.showMessageWarning("La visite existe déjà !")
                  } else {
                    this.showMessageSuc(`Votre visite a été ajoutée avec succès`);
                  }
                },
                (err) => {
                  if (err.status == 409) {
                    let info = err.error;
                    let message;
                    let s = info.conflictCount > 1 ? "s" : "";
                    if (info.conflictSource == "evenement") {
                      message = `La date choisie est occupé par un évènement !`;
                      Swal.fire({
                        icon: "warning",
                        text: message,
                        showConfirmButton: false,
                        heightAuto: false,
                        timer: 2500,
                      });
                    } else if (info.conflictSource == "visite") {
                      message = `La date choisie est occupé par une visite !`;
                      Swal.fire({
                        icon: "warning",
                        text: message,
                        showConfirmButton: false,
                        heightAuto: false,
                        timer: 2500,
                      });
                    }
                  } else {
                    this.showMessageError();
                  }
                }
              );
            }
          }
        } else {
          this.showMessageWarning("Veuillez choisir une date visite inférieure ou égale à aujourd'hui !")
        }
      }
    }, 100);

  }

  isLineProduitValid(produit?) {
    var valid = true;
    produit.forEach((el) => {
      if (!el.gamme || el.echantillon < 0 || !el.produit) valid = false;
      if (el.echantillon === null) el.echantillon = 0
    });
    if (produit.length == 0) valid = false;
    return valid;
  }

  setHeureFinVisite(hourDebut) {
    this.form.get('time_fin_visite').setValue(moment(hourDebut, 'HH:mm').add(30, 'm').format('HH:mm'))
    this.listHoursFinVisite = this.listHours
    this.listHoursFinVisite = this.listHoursFinVisite.filter((heure) => {
      if (moment(heure, 'HH:mm').isAfter(moment(hourDebut, 'HH:mm'))) return true
    })
  }

  getVisite() {
    this.isLoading = true;
    this.visiteService.getFicheVisite(this.id_visite)
      .subscribe((res: any) => {
        this.visite = res.visite;
        this.typeVisite = this.visite.typeVisite
        this.partenaires = res.visite.partenaires
        this.getPartenaire();
        this.initForm(this.visite);
        this.getGammesProduits();
        this.isLoading = false;
      }, err => {
        // this.showMessageError();
      })
  }
  tmpFix() {
    // console.log(this.partenaires, 'here')
    this.partenaires.forEach((par, i) => {
      // console.log(this.partenaires, this.filterelistePartenaires)
      this.openChange(true, i, par.id_partenaire)
    })
  }
  nomCompteSelectionChange() {
    setTimeout(() => this.tmpFix(), 0)
  }
  getPartenaire() {
    this.listeCodifService.getListePartenaire('')
      .subscribe((res: any) => {
        this.listePartenaires = res.partenaires;
        this.resetFilterPartenaires()
        this.partenaires.forEach((partenaire, i) => {
          partenaire.showNomRemplacent = !!partenaire.nom_remplacent
        })
        this.selectPartenaire()
      }, err => {
        // this.showMessageError();
      })
  }
  resetFilterPartenaires() {
    this.filterelistePartenaires = []
    if (this.typeVisite === 'G') {
      for (let i = 0; i < this.partenaires.length; i++)
        this.filterelistePartenaires.push(
          this.listePartenaires.filter(par =>
            (this.partenaires.findIndex(item =>
              item.id_partenaire == par.id_partenaire) == -1
              ||
              par.id_partenaire == this.partenaires[i].id_partenaire)
            &&
            par.code_type_partenaire === 'MEDE'
          ))
    }
    else {
      this.filterelistePartenaires.push(this.listePartenaires)
    }
  }

  filterPartenaires(value, index) {
    this.resetFilterPartenaires()
    this.filterelistePartenaires[index] = this.filterelistePartenaires[index].
      filter(partenaire => partenaire.nom_partenaire.toUpperCase().includes(value.toUpperCase()))

  }

  setNbrEchantillon(produit) {
    produit.echantillon = 0
  }

  typeVisiteChange() {
    this.resetFilterPartenaires()
    this.partenaires.splice(1)
    setTimeout(() => {
      this.tmpFix()
    }, 0);
  }

  selectPartenaire(item?, index?) {
    // this.getGammesProduits(item.code_specialite);
    if (index || item) {
      this.partenaires[index].id_partenaire = item.id_partenaire
      this.partenaires[index].nom_partenaire = item.nom_partenaire
      this.partenaires[index].code_type_partenaire = item.code_type_partenaire
      this.partenaires[index].code_region_partenaire = item.code_region_partenaire
      this.partenaires[index].code_gamme_partenaire = item.code_gamme_partenaire
      this.partenaires[index].nom_remplacent = ''
      this.partenaires[index].showNomRemplacent = false
    }
    if (this.checkIfMedecin()) {
      this.mediafxFlex = 20
    } else {
      this.mediafxFlex = 28
    }
  }

  onChangeStatutVisite() {
    if (this.form.controls['code_statut_visite'].value == 'REPL' || this.form.controls['code_statut_visite'].value == 'ENAT') {
      this.form.get('flag_accompagnee').setValue(this.visite ? this.visite?.flag_accompagnee == 'O' ? true : false : null);
      this.form.get('id_visiteur').setValue(this.visite ? this.visite?.id_accompagnant : null);
      this.partenaires.splice(1);
      this.partenaires[0].nom_remplacent = ''
      this.partenaires[0].showNomRemplacent = false
      this.typeVisite = 'S'
    }
    if (this.form.controls['code_statut_visite'].value == 'REAL' && this.produits.length == 0) {
      this.addLineProduits();
    } else if (this.form.controls['code_statut_visite'].value != 'REAL') {
      this.produits = []
    }
    if (this.form.controls['code_statut_visite'].value != 'ABSE') {
      this.form.get('commentaire').setValue(this.visite ? this.visite?.commentaire : null);
    }
    if (this.form.controls['code_statut_visite'].value != 'REPL') {
      this.form.get('date_replanification').setValue(this.visite ? this.visite?.date_replanification : null);
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

  getGammesProduits() {
    const body = {
      // "code_specialite": code_specialite
    }
    this.listeCodifService.getGammesProduits(body).subscribe(
      (res: any) => {
        this.listeGammesProduits = res.gammes;
        if (this.id_visite) {
          this.produits = this.visite?.produits.map(item => {
            const itemProduit = this.listeGammesProduits.filter(
              (itemCodif) => itemCodif.code_codification == item.code_gamme
            )[0]
            return {
              jour: item.jour,
              gamme: item.code_gamme,
              searchGamme: null,
              listeGammes: this.listeGammesProduits,
              filtereGammes: this.listeGammesProduits,
              produit: item.id_produit,
              searchProduit: null,
              listeProduits: itemProduit ? itemProduit?.produits : [],
              filtereProduits: itemProduit ? itemProduit?.produits : [],
              feedback: item.code_feedback,
              echantillon: item.nbr_echantillon,
              avecEchantillon: item.nbr_echantillon > 0
            }
          })
        } else {
          this.produits = []
          this.addLineProduits();
        }
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
