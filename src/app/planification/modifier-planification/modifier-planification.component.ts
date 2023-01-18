// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { PageTitleService } from 'app/core/page-title/page-title.service';
// import { CurrentUserService } from 'app/service/current-user.service';
// import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
// import { PlanificationService } from 'app/service/planification-service/planification.service';
// import * as moment from 'moment';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'ms-modifier-planification',
//   templateUrl: './modifier-planification.component.html',
//   styleUrls: ['./modifier-planification.component.scss']
// })
// export class ModifierPlanificationComponent implements OnInit {
//   isLoading: boolean = false;
//   listePlanificationPartenaire = []
//   listeSpecialites = []
//   listeRevis = []
//   listeVilles = []
//   listeSecteurs = []
//   listeDatesSemaine = []
//   form: FormGroup;
//   userItem;
//   isSubmitted: boolean = false;
//   sem_actuelle;
//   isLoadingPlanifies: boolean = false;
//   listePlanifiesPartenaire;
//   id_planification;
//   nbr_med_planifies = 0;
//   nbr_phrama_planifiees = 0;
//   date_jour;
//   listHours = [];
//   hoursRangeStart = 0;
//   hoursRangeEnd = 23;
//   dateVisiteGlobalControl = new FormControl(null);

//   constructor(
//     private planificationService: PlanificationService,
//     private formBuilder: FormBuilder,
//     private pageTitleService: PageTitleService,
//     private _currentUser: CurrentUserService,
//     private listeCodifService: ListeCodifService,
//     private route: ActivatedRoute,
//     public router: Router
//   ) {
//     this.userItem = this._currentUser.getRoleCurrentUser();
//     this.id_planification = this.route.snapshot.paramMap.get('id_planification');
//   }

//   ngOnInit(): void {
//     this.get_hours_range();
//     setTimeout(() => {
//       this.pageTitleService.setTitle('Modifier Planification');
//     }, 0);
//     this.getPartenairePlanifies();
//     this.initForm();
//     this.getSpecialites();
//     this.getRevis();
//   }

//   get_hours_range() {
//     this.listeCodifService.get_hours_range()
//       .subscribe((res: any) => {
//         this.hoursRangeStart = Number(res["HRSTART"].libelle_codification);
//         this.hoursRangeEnd = Number(res["HREND"].libelle_codification);
//         this.initHours();
//       });
//   }

//   initHours(){
//     for(let i = this.hoursRangeStart; i <= this.hoursRangeEnd; i++){
//       if(String(i).length == 1){
//         this.listHours.push(`0${i}:00`);
//         // this.listHours.push(`0${i}:30`);
//       }
//       else{
//         this.listHours.push(`${i}:00`);
//         // this.listHours.push(`${i}:30`);
//       }
//     }
//   }

//   onKeyupRefNom(){
//     if(!this.form.controls['id_partenaire'].value){
//       this.form.controls['id_partenaire'].setValue(null);
//     }
//     if(!this.form.controls['nom_partenaire'].value){
//       this.form.controls['nom_partenaire'].setValue(null);
//     }
//   }

//   isSearchable(){
//     return ( 
//       this.form.controls['type_partenaire'].value ||
//       this.form.controls['potentiel'].value?.length ||
//       this.form.controls['code_specialite'].value?.length ||
//       this.form.controls['code_region'].value ||
//       this.form.controls['code_ville'].value ||
//       this.form.controls['code_secteur'].value ||
//       this.form.controls['id_partenaire'].value ||
//       this.form.controls['nom_partenaire'].value
//     )
//   }

//   initForm() {
//     this.form = this.formBuilder.group({
//       type_partenaire: [{
//         value: this.userItem.flag_medical == 'O' && this.userItem.flag_pharmaceutique == 'N' ? 'MEDE' : this.userItem.flag_medical == 'N' && this.userItem.flag_pharmaceutique == 'O' ? 'PHAR' : null,
//         disabled: this.userItem.flag_medical != this.userItem.flag_pharmaceutique ? true : false
//       }],
//       potentiel: [null],
//       code_specialite: [null],
//       code_region: [null],
//       code_ville: [{ value: null, disabled: true }],
//       code_secteur: [{ value: null, disabled: true }],
//       id_partenaire: [null],
//       nom_partenaire: [null],
//     });
//     this.onChangeTypePartenaire();
//   }

//   reset() {
//     this.initForm();
//     this.isSubmitted = false
//     this.onChangeTypePartenaire();
//     this.selectVille({});
//     this.listePlanificationPartenaire = [];
//   }

//   filtrer() {
//     this.isSubmitted = true;
//     setTimeout(() => {
//       if (this.isSubmitted == true && this.form.valid) {
//         this.getPlanificationPartenaire();
//       }
//     }, 100);
//   }

//   getListeDatesSemaine(date_jour, date_debut_planification, date_fin_planification) {
//     this.listeDatesSemaine = []

//     var date_debut_plan = moment(date_debut_planification)
//     var date_debut = date_debut_plan.diff(moment(date_jour), 'days', true) <= 0 ? date_jour : date_debut_planification

//     for (
//       var date = moment(date_debut);
//       date.diff(date_fin_planification, 'days') <= 0;
//       date.add(1, 'days')
//     ) {
//       this.listeDatesSemaine.push(date.format('YYYY-MM-DD'));
//     }
//   }

//   getPlanificationPartenaire() {
//     this.isLoading = true;
//     this.listePlanificationPartenaire = [];

//     // const body = this.form.value;
//     const body = {
//       id_planification: this.id_planification,
//       type_partenaire: this.form.controls['type_partenaire'].value,
//       potentiel: this.form.controls['potentiel'].value?.length ? this.form.controls['potentiel'].value : null,
//       code_specialite: this.form.controls['code_specialite'].value?.length ? this.form.controls['code_specialite'].value : null,
//       code_region: this.form.controls['code_region'].value,
//       code_ville: this.form.controls['code_ville'].value,
//       code_secteur: this.form.controls['code_secteur'].value,
//       id_partenaire: this.form.controls['id_partenaire'].value,
//       nom_partenaire: this.form.controls['nom_partenaire'].value,

//     }
//     this.planificationService.getPlanificationPartenaire(body).subscribe(
//       (res: any) => {
//         this.listePlanificationPartenaire = res.partenaires;
//         this.date_jour = res?.date_jour;
//         this.getListeDatesSemaine(this.date_jour, this.sem_actuelle?.date_debut, this.sem_actuelle?.date_fin)
//         if (this.listePlanificationPartenaire?.length)
//           this.listePlanificationPartenaire =
//             this.listePlanificationPartenaire.map((item) => {
//               return {
//                 code_type_partenaire: item.code_type_partenaire,
//                 date_derniere_visite: item.date_derniere_visite,
//                 id_partenaire: item.id_partenaire,
//                 nom_partenaire: item.nom_partenaire,
//                 potentiel: item.potentiel,
//                 secteur_partenaire: item.secteur_partenaire,
//                 specialite_partenaire: item.specialite_partenaire,
//                 ville_partenaire: item.ville_partenaire,
//                 date_visite: null,
//               };
//             });
//         this.isLoading = false;
//       },
//       (err) => {
//         // this.showMessageError();
//         this.isLoading = false;
//       }
//     );
//   }

//   getPartenairePlanifies() {
//     this.isLoadingPlanifies = true;
//     this.listePlanifiesPartenaire = [];

//     this.planificationService.updPartenairePlanifies(this.id_planification).subscribe(
//       (res: any) => {
//         if(res.flag_disponible == 'N'){
//           Swal.fire({
//             icon: 'error',
//             title: `Une erreur est survenue`,
//             text: 'La page recherchée est introuvable',
//             showConfirmButton: false,
//             heightAuto: false,
//             timer: 2500
//           });
//           this.router.navigate(['/planifications/liste']);
//         }
//         this.listePlanifiesPartenaire = res.partenaires;
//         this.nbr_med_planifies = res.nbr_med_planifies;
//         this.nbr_phrama_planifiees = res.nbr_phrama_planifiees;
//         this.sem_actuelle = {
//           date_debut : res.date_deb_planification,
//           date_fin : res.date_fin_planification,
//           num_semaine : res.num_semaine
//         }
//         this.getListeDatesSemaine(this.date_jour, this.sem_actuelle?.date_debut, this.sem_actuelle?.date_fin)
//         if (this.isSubmitted == true && this.form.valid) {
//           this.getPlanificationPartenaire();
//         }
//         this.isLoadingPlanifies = false;
//       },
//       (err) => {
//         this.isLoadingPlanifies = false;
//       }
//     );
//   }

//   ajouterPartenairePlanifiee(item) {
//     let date = this.dateVisiteGlobalControl.value || item.date_visite;
//     const body = {
//       id_planification: this.id_planification,
//       id_partenaire: item.id_partenaire,
//       date_visite: date + " " + item.heure_visite,
//     };
//     if (date && item.heure_visite)
//       this.planificationService.ajouterPartenairePlanifiee(body).subscribe(
//         (res: any) => {
//           this.getPartenairePlanifies();
//           this.getPlanificationPartenaire();
//         },
//         (err) => {
//           // this.showMessageError();
//         }
//       );
//     else {
//       Swal.fire({
//         icon: 'warning',
//         text: !date ? `Veuillez choisir une date !` : `Veuillez choisir une heure !`,
//         showConfirmButton: false,
//         heightAuto: false,
//         timer: 2500
//       });
//     }
//   }

//   annulerPartenairePlanifiee(item) {
//     Swal.fire({
//       text: "Êtes-vous sûr de vouloir supprimer la planification ?",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: 'var(--princ-health-color)',
//       cancelButtonColor: '#b4b2b2',
//       confirmButtonText: 'Supprimer',
//       cancelButtonText: 'Annuler',
//       heightAuto: false,
//     }).then((result) => {
//       if (result.value) {
//         const body = {
//           id_visite: item.id_visite,
//         };
//         this.planificationService.annulerPartenairePlanifiee(body).subscribe(
//           (res: any) => {
//             console.log(res);
//             this.getPartenairePlanifies();
//             if (this.isSubmitted == true && this.form.valid) {
//               this.getPlanificationPartenaire();
//             }
//           },
//           (err) => {
//             // this.showMessageError();
//           }
//         );
//       }
//     })
//   }

//   getSpecialites() {
//     this.listeCodifService.getSpecialites().subscribe(
//       (res: any) => {
//         this.listeSpecialites = res.specialites;
//       },
//       (err) => {
//         // this.showMessageError();
//       }
//     );
//   }

//   getRevis() {
//     this.listeCodifService.getRevis().subscribe(
//       (res: any) => {
//         this.listeRevis = res.regions;
//       },
//       (err) => {
//         // this.showMessageError();
//       }
//     );
//   }

//   onChangeTypePartenaire() {
//     if (this.form.controls['type_partenaire'].value == 'PHAR') {
//       this.form.get('code_specialite').setValue(null);
//       this.form.get('code_specialite').disable();
//     } else {
//       this.form.get('code_specialite').enable();
//     }
//   }

//   selectVille(item) {
//     this.listeVilles = item.villes ? item.villes : [];
//     this.listeSecteurs = [];
//     this.form.get('code_ville').setValue(null);
//     this.form.get('code_secteur').setValue(null);

//     if (this.listeVilles?.length == 0 || !this.listeVilles) {
//       this.form.get('code_ville').disable();
//       this.form.get('code_secteur').disable();
//     } else {
//       this.form.get('code_ville').enable();
//       this.form.get('code_secteur').enable();
//     }
//   }

//   selectSecteur(item) {
//     this.listeSecteurs = item.secteurs ? item.secteurs : [];
//     this.form.get('code_secteur').setValue(null);

//     if (this.listeSecteurs?.length == 0 || !this.listeSecteurs) {
//       this.form.get('code_secteur').disable();
//     } else {
//       this.form.get('code_secteur').enable();
//     }
//   }

//   showMessageError() {
//     Swal.fire({
//       icon: 'error',
//       title: `Une erreur est survenue`,
//       text: 'Veuillez réessayer plus tard',
//       showConfirmButton: false,
//       heightAuto: false,
//       timer: 2500
//     });
//   }

// }
