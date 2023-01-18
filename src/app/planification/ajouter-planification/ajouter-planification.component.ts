import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { PageTitleService } from 'app/core/page-title/page-title.service';
import { CurrentUserService } from 'app/service/current-user.service';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import { PlanificationService } from 'app/service/planification-service/planification.service';
import * as moment from 'moment';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import Swal from 'sweetalert2';
import { style, state, animate, transition, trigger } from '@angular/animations';
import { ParamsAppService } from "../../service/params-app-service/params-app.service";
import { AjouterRapportComponent } from '../ajouter-rapport/ajouter-rapport.component';
import { MatDialog } from '@angular/material/dialog';
import { AjouterVisiteComponent } from 'app/visite/ajouter-visite/ajouter-visite.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ms-ajouter-planification',
  templateUrl: './ajouter-planification.component.html',
  styleUrls: ['./ajouter-planification.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AjouterPlanificationComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) datesPaginator: MatPaginator;
  @ViewChild(SlickCarouselComponent) slickCarousel: SlickCarouselComponent;

  isLoading: boolean = false;
  listePlanificationPartenaire = []
  listeSemaines = []
  listeSpecialites = []
  listeRevis = []
  listeVilles = []
  listeSecteurs = []
  listeDatesSemaine = []
  semaineControl = new FormControl('', Validators.required);
  form: FormGroup;
  userItem;
  isSubmitted: boolean = false;
  sem_actuelle;
  isLoadingPlanifies: boolean = false;
  listePlanifiesPartenaire;
  id_planification;
  nbr_med_planifies = 0;
  nbr_phrama_planifiees = 0;
  date_jour
  listHours = [];
  hoursRangeStart = 0;
  hoursRangeEnd = 23;
  dateVisiteGlobalControl = new FormControl(null);
  totalDates = 21
  datesList = [];
  pageSizePartenaires = 10;
  pageIndexPartenaires = 0;
  jourFuturPlanif;
  jourPassPlanif;
  jourPassRapportAdd;
  jourPassRapportModif;
  visitesCount;
  slideConfig = {
    slidesToShow: 7,
    slidesToScroll: 7,
    // variableWidth: true,
    infinite: false,
    focusOnSelect: true,
    initialSlide: 0,
    centerMode: true,
    centerPadding: '60px',
    draggable: false,
    cssEase: "ease-out",
    speed: 400,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          // arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          // arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 1
        }
      }
    ]
  };
  dateIndex;
  datePlanification;
  cantPlan = false;
  nbr_total_partenaires;
  dateParam;
  dateParamIndex;

  constructor(
    private planificationService: PlanificationService,
    private formBuilder: FormBuilder,
    private pageTitleService: PageTitleService,
    private _currentUser: CurrentUserService,
    private listeCodifService: ListeCodifService,
    private paramsAppService: ParamsAppService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
  ) {
    this.userItem = this._currentUser.getRoleCurrentUser();
    this.route.queryParams.subscribe(params => {
      this.dateParam = params['date_planif'];
      this.datePlanification = this.dateParam;
    });
  }

  ngOnInit(): void {
    this.getInfos();
    this.get_app_params();
    // this.get_hours_range();
    setTimeout(() => {
      this.pageTitleService.setTitle('Assistant de planification');
    }, 0);
    this.initForm();
    // this.getSemaines();
    // this.getPlanificationPartenaire()
    this.getSpecialites();
    this.getRevis();

    // this.getDates();
    // this.getPlanificationPartenaire();
    this.getPartenairePlanifies();
  }

  @ViewChild(InfiniteScrollDirective) infiniteScroll: InfiniteScrollDirective;

  onScrollPartenaires() {
    if (this.nbr_total_partenaires < this.pageIndexPartenaires * this.pageSizePartenaires) return;
    this.getPlanificationPartenaire(this.pageSizePartenaires, ++this.pageIndexPartenaires);
    this.infiniteScroll.ngOnDestroy();
    this.infiniteScroll.setup();
  }

  public trackById(index, item) {
    return item.id_visite;
  }

  getInfos() {
    this._currentUser.getInfos()
      .subscribe((res: any) => {
        this.date_jour = moment(res.date_jour).format('YYYY-MM-DD HH:mm');
        this.datePlanification = this.datePlanification || moment(this.date_jour).format('YYYY-MM-DD');
        this.initHours();
      }, err => {
      })
  }

  get_app_params() {
    this.paramsAppService.get().then((params: any) => {
      this.jourFuturPlanif = Number(params["JOPL"]["JRFUTURPL"]);
      this.jourPassPlanif = Number(params["JOPL"]["JRPASSPL"]);
      this.hoursRangeStart = Number(params["HEVI"]["HRSTART"]);
      this.hoursRangeEnd = Number(params["HEVI"]["HREND"]);
      this.jourPassRapportAdd = Number(params["JRRP"]["JRPASSRPADD"]);
      this.jourPassRapportModif = Number(params["JRRP"]["JRPASSRPMOD"]);

      this.getDates();
      this.setAlltimesOfDay(this.datePlanification || moment(this.date_jour).format('YYYY-MM-DD'), this.hoursRangeStart, this.hoursRangeEnd)

      this.dateParamIndex = this.datesList.findIndex(d => d == this.dateParam);
      if (this.dateParamIndex == -1) this.dateParamIndex = null;

      this.slideConfig.initialSlide = this.dateParamIndex || this.jourPassPlanif;
      this.dateIndex = this.dateParamIndex || this.jourPassPlanif;
    });
  }

  ngAfterViewInit(): void {
    this.dateIndex = this.slickCarousel.config.initialSlide;

  }


  getDates() {

    let date_start = moment(this.date_jour).add(-this.jourPassPlanif, "days");
    let date_end = moment(this.date_jour).add(this.jourFuturPlanif, "days");
    for (
      var date = date_start;
      date.diff(date_end, 'days') <= 0;
      date.add(1, 'days')
    ) {
      this.datesList.push(date.format('YYYY-MM-DD'));
      // this.datesList.push(date);
    }

  }

  carouselChange(e) {
    this.pageIndexPartenaires = 0;
    this.listePlanificationPartenaire = [];
    this.dateIndex = e.currentSlide;
    this.datePlanification = this.datesList[e.currentSlide];
    this.cantPlan = moment(this.datePlanification, "").isBefore(moment(this.date_jour).format('YYYY-MM-DD'));
    this.getPartenairePlanifies();
    this.initHours();
    if (!this.cantPlan) {
      if (this.isSubmitted == true && this.form.valid) {
        this.getPlanificationPartenaire(this.pageSizePartenaires, this.pageIndexPartenaires);
      }
    }
    else {
      this.listePlanificationPartenaire = [];
    }
  }

  updateCarouselSize() {
    // this.slickCarousel.slickGoTo(this.dateIndex);
  }

  openDialogAjouterRapport(item): void {
    const dialogRef = this.dialog.open(AjouterRapportComponent, {
      width: '800px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.userItem = this.userItem;
    dialogRef.componentInstance.itemRapport = item;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPartenairePlanifies();
        // this.reset()
        // this.getRapports(this.pageSize, this.pageIndex);
        // ok Valider
      }
    })
  }

  openDialogModifierVisite(mode?, idVisite?, idPartenaire?, idPlanification?): void {
    const dialogRef = this.dialog.open(AjouterVisiteComponent, {
      width: '950px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.id_visite = idVisite;
    dialogRef.componentInstance.idPartenaire = idPartenaire;
    // dialogRef.componentInstance.id_planification = idPlanification;
    dialogRef.componentInstance.mode = mode;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPartenairePlanifies();
        // this.reset()
        // this.getRapports(this.pageSize, this.pageIndex);
        // ok Valider
      }
    })
  }

  canAddRapport(dateVisite) {
    let minDate = moment(this.date_jour).add(-this.jourPassRapportAdd, "days").format("YYYY-MM-DD") + " 00:00";
    let maxDate = moment(this.date_jour).format("YYYY-MM-DD HH:mm")
    return moment(dateVisite).isSameOrAfter(minDate) && moment(dateVisite).isSameOrBefore(maxDate);
    // return new Date(dateVisite).getTime() >= new Date(minDate).getTime() && new Date(dateVisite).getTime() <= new Date(maxDate).getTime();
  }

  canModifyRapport(dateVisite) {
    let minDate = moment(this.date_jour).add(-this.jourPassRapportModif, "days").format("YYYY-MM-DD") + " 00:00";
    let maxDate = moment(this.date_jour).format("YYYY-MM-DD HH:mm")
    return moment(dateVisite).isSameOrAfter(minDate) && moment(dateVisite).isSameOrBefore(maxDate);
    // return new Date(dateVisite).getTime() >= new Date(minDate).getTime() && new Date(dateVisite).getTime() <= new Date(maxDate).getTime();
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
    let startHour;
    if (moment(this.date_jour).format("YYYY-MM-DD") == moment(this.datePlanification).format("YYYY-MM-DD")) {
      startHour = moment(this.date_jour).hour() + 1;
    }
    this.listHours = [];
    for (let i = startHour || this.hoursRangeStart; i < this.hoursRangeEnd; i++) {
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

  getHours() {
    let startHour;
    if (moment(this.date_jour).format("YYYY-MM-DD") == moment(this.date_jour).format("YYYY-MM-DD")) {
      startHour = moment(this.date_jour).hour() + 1;
    }
    for (let i = startHour || this.hoursRangeStart; i <= this.hoursRangeEnd; i++) {
      if (String(i).length == 1) {
        this.listHours.push(`0${i}:00`);
        // this.listHours.push(`0${i}:30`);
      }
      else {
        this.listHours.push(`${i}:00`);
        // this.listHours.push(`${i}:30`);
      }
    }
    return this.listHours;
  }

  onKeyupRefNom() {
    if (!this.form.controls['id_partenaire'].value) {
      this.form.controls['id_partenaire'].setValue(null);
    }
    if (!this.form.controls['nom_partenaire'].value) {
      this.form.controls['nom_partenaire'].setValue(null);
    }
  }

  isSearchable() {
    return (
      this.form.controls['type_partenaire'].value ||
      this.form.controls['potentiel'].value?.length ||
      this.form.controls['code_specialite'].value?.length ||
      this.form.controls['code_region'].value ||
      this.form.controls['code_ville'].value ||
      this.form.controls['code_secteur'].value ||
      this.form.controls['id_partenaire'].value ||
      this.form.controls['nom_partenaire'].value
    )
  }

  initForm() {
    this.form = this.formBuilder.group({
      type_partenaire: [{
        value: this.userItem.flag_medical == 'O' && this.userItem.flag_pharmaceutique == 'N' ? 'MEDE' : this.userItem.flag_medical == 'N' && this.userItem.flag_pharmaceutique == 'O' ? 'PHAR' : null,
        disabled: this.userItem.flag_medical != this.userItem.flag_pharmaceutique ? true : false
      }],
      potentiel: [null],
      code_specialite: [null],
      code_region: [null],
      code_ville: [{ value: null, disabled: true }],
      code_secteur: [{ value: null, disabled: true }],
      id_partenaire: [null],
      nom_partenaire: [null],
    });
    this.onChangeTypePartenaire();
  }

  reset() {
    this.initForm();
    this.isSubmitted = false
    this.onChangeTypePartenaire();
    this.selectVille({});
    this.listePlanificationPartenaire = [];
    this.pageIndexPartenaires = 0;
  }

  filtrer() {
    this.pageIndexPartenaires = 0;
    this.listePlanificationPartenaire = [];
    this.isSubmitted = true;
    setTimeout(() => {
      // if (this.isSubmitted == true && this.form.valid) {
      //   this.getPlanificationPartenaire();
      // }
      if (!this.cantPlan) {
        if (this.isSubmitted == true && this.form.valid) {
          this.getPlanificationPartenaire(this.pageSizePartenaires, this.pageIndexPartenaires);
        }
      }
      else {
        Swal.fire({
          icon: "warning",
          text: `Désolé vous ne pouvez pas planifier dans le passé !`,
          showConfirmButton: false,
          heightAuto: false,
          timer: 2500,
        });
      }
    }, 100);
  }

  getSemaines() {
    this.listeCodifService.getSemaines().subscribe(
      (res: any) => {
        this.listeSemaines = res.liste_semaines;
        if (this.listeSemaines?.length) {
          this.sem_actuelle = this.listeSemaines.filter(
            (them) => them.flag_sem_actuelle == 'O'
          )[0];
          this.semaineControl.setValue(this.sem_actuelle);
          this.getPartenairePlanifies();
          this.ajouterPlanification();
          if (this.isSubmitted == true && this.form.valid) {
            this.getPlanificationPartenaire(this.pageSizePartenaires, this.pageIndexPartenaires);
          }
        }
      },
      (err) => {
        // this.showMessageError();
      }
    );
  }

  getListeDatesSemaine(date_jour, date_debut_planification, date_fin_planification) {
    this.listeDatesSemaine = []

    var date_debut_plan = moment(date_debut_planification)
    var date_debut = date_debut_plan.diff(moment(date_jour), 'days', true) <= 0 ? date_jour : date_debut_planification

    for (
      var date = moment(date_debut);
      date.diff(date_fin_planification, 'days') <= 0;
      date.add(1, 'days')
    ) {
      this.listeDatesSemaine.push(date.format('YYYY-MM-DD'));
    }
  }

  getPlanificationPartenaire(records_per_page, page_number) {
    // this.isLoading = true;
    // this.listePlanificationPartenaire = [];

    // const body = this.form.value;
    const body = {
      date_planification: this.datePlanification || moment(this.date_jour).format('YYYY-MM-DD'),
      // id_planification: this.id_planification,
      type_partenaire: this.form.controls['type_partenaire'].value,
      potentiel: this.form.controls['potentiel'].value?.length ? this.form.controls['potentiel'].value : null,
      code_specialite: this.form.controls['code_specialite'].value?.length ? this.form.controls['code_specialite'].value : null,
      code_region: this.form.controls['code_region'].value,
      code_ville: this.form.controls['code_ville'].value,
      code_secteur: this.form.controls['code_secteur'].value,
      id_partenaire: this.form.controls['id_partenaire'].value,
      nom_partenaire: this.form.controls['nom_partenaire'].value,

    }
    this.planificationService.getPlanificationPartenaire(records_per_page, page_number, body).subscribe(
      (res: any) => {
        this.listePlanificationPartenaire.push(...(res.partenaires));
        // this.date_jour = res?.date_jour;
        this.nbr_total_partenaires = res.nbr_total_partenaires;
        if (this.listePlanificationPartenaire?.length)
          this.listePlanificationPartenaire =
            this.listePlanificationPartenaire.map((item) => {
              return {
                code_type_partenaire: item.code_type_partenaire,
                date_derniere_visite: item.date_derniere_visite,
                id_partenaire: item.id_partenaire,
                nom_partenaire: item.nom_partenaire,
                potentiel: item.potentiel,
                secteur_partenaire: item.secteur_partenaire,
                specialite_partenaire: item.specialite_partenaire,
                ville_partenaire: item.ville_partenaire,
                date_visite: null,
              };
            });
        this.isLoading = false;
      },
      (err) => {
        // this.showMessageError();
        this.isLoading = false;
      }
    );
  }

  setAlltimesOfDay(day, start?, end?) {
    this.listePlanifiesPartenaire = []
    let diff = (end - start) * 2
    var today = moment(day).hours(start - 1).minutes(30)
    for (let time = 0; time < diff; time++) {
      this.listePlanifiesPartenaire.push({
        "id_visite": null,
        "id_partenaire": null,
        "date_visite": today.add(30, 'm').format('YYYY-MM-DD HH:mm:ss'),
        "code_statut_visite": null,
        "potentiel": null,
        "nom_partenaire": null,
        "code_type_partenaire": null,
        "specialite_partenaire": null,
        "ville_partenaire": null,
        "secteur_partenaire": null,
        "heure_fin_visite": today.add(30, 'm').format('HH:mm:ss')
      })
      today.subtract(30, 'm')
    }
  }

  getPartenairePlanifies() {
    this.isLoadingPlanifies = true;
    this.setAlltimesOfDay(this.datePlanification || moment(this.date_jour).format('YYYY-MM-DD'), this.hoursRangeStart, this.hoursRangeEnd)
    const body = {
      // date_debut_planification: this.semaineControl.value.date_debut + " 00:00",
      // date_fin_planification: this.semaineControl.value.date_fin + " 23:59",
      // date_debut_planification: "2022-08-01" + " 00:00",
      // date_fin_planification: "2022-08-12" + " 23:59",
      // date_planification: "2022-08-12",
      date_planification: this.datePlanification || moment(this.date_jour).format('YYYY-MM-DD'),
    };

    this.planificationService.getPartenairePlanifies(body).subscribe(
      (res: any) => {
        let heure_visite,
          heure_debut_visite,
          heure_fin_visite,
          visites = this.listePlanifiesPartenaire
        this.visitesCount = res.partenaires?.length || 0
        this.listePlanifiesPartenaire.forEach((visite, i) => {
          heure_visite = moment(visite.date_visite, 'YYYY-MM-DD HH:mm').format('HH:mm')
          res.partenaires.forEach(item => {
            heure_debut_visite = moment(item.date_visite, 'YYYY-MM-DD HH:mm').format('HH:mm')
            heure_fin_visite = moment(item.heure_fin_visite, 'HH:mm').format('HH:mm')
            if (moment(visite.date_visite, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss') === moment(item.date_visite, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss')) {
              Object.assign(visites[i], item)
            } else if (moment(heure_visite, 'HH:mm').isBetween(moment(heure_debut_visite, 'HH:mm'), moment(heure_fin_visite, 'HH:mm'))) {
              delete visites[i]
            }


          })
        })

        // this.listePlanifiesPartenaire = res.partenaires;
        this.listePlanifiesPartenaire = visites.filter(n => n)


        this.nbr_med_planifies = res.nbr_med_planifies;
        this.nbr_phrama_planifiees = res.nbr_phrama_planifiees;
        this.isLoadingPlanifies = false;
      },
      (err) => {
        // this.showMessageError();
        this.isLoadingPlanifies = false;
      }
    );
  }

  ajouterPlanification() {
    const body = {
      date_debut_planification: this.semaineControl.value.date_debut,
      date_fin_planification: this.semaineControl.value.date_fin,
    };
    this.planificationService.ajouterPlanification(body).subscribe(
      (res: any) => {
        this.id_planification = res.id_planification;
        this.getListeDatesSemaine(this.date_jour, body.date_debut_planification, body.date_fin_planification)
      },
      (err) => {
        // this.showMessageError();
      }
    );
  }

  ajouterPartenairePlanifiee(item) {
    let date = this.dateVisiteGlobalControl.value || item.date_visite;

    let date_visite = this.datePlanification + " " + item.heure_visite + ":00";
    const body = {
      // id_planification: this.id_planification,
      id_partenaire: item.id_partenaire,
      date_visite,
      heure_fin_visite: moment(date_visite).add("minutes", 30).format("HH:mm:ss")
    };
    if (item.heure_visite)
      this.planificationService.ajouterPartenairePlanifiee(body).subscribe(
        (res: any) => {
          if (res?.duplicate) {
            this.showMessageWarning("La planification existe déjà pour cette date")
          }
          this.getPartenairePlanifies();
          this.pageIndexPartenaires = 0;
          this.listePlanificationPartenaire = [];
          this.getPlanificationPartenaire(this.pageSizePartenaires, this.pageIndexPartenaires);
        },
        (err) => {
          if (err.status == 409) {
            Swal.fire({
              icon: "warning",
              // text: `L'heure choisie (${item.heure_visite}) est occupé par une autre planification !`,
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
    else {
      Swal.fire({
        icon: 'warning',
        text: `Veuillez choisir une heure !`,
        showConfirmButton: false,
        heightAuto: false,
        timer: 2500
      });
    }
  }

  annulerPartenairePlanifiee(item) {
    Swal.fire({
      text: "Êtes-vous sûr de vouloir supprimer la planification ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--princ-health-color)',
      cancelButtonColor: '#b4b2b2',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      heightAuto: false,
    }).then((result) => {
      if (result.value) {
        const body = {
          id_visite: item.id_visite,
        };
        this.planificationService.annulerPartenairePlanifiee(body).subscribe(
          (res: any) => {
            this.getPartenairePlanifies();
            if (this.isSubmitted == true && this.form.valid) {
              this.pageIndexPartenaires = 0;
              this.listePlanificationPartenaire = [];
              this.getPlanificationPartenaire(this.pageSizePartenaires, this.pageIndexPartenaires);
            }
          },
          (err) => {
            // this.showMessageError();
          }
        );
      }
    })
  }

  getSpecialites() {
    this.listeCodifService.getSpecialites().subscribe(
      (res: any) => {
        this.listeSpecialites = res.specialites;
      },
      (err) => {
        // this.showMessageError();
      }
    );
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

  // selectSemaine() {
  //   this.getPartenairePlanifies();
  //   this.ajouterPlanification();
  //   if (this.isSubmitted == true && this.form.valid) {
  //     this.getPlanificationPartenaire();
  //   }
  //   this.dateVisiteGlobalControl.setValue(null);
  // }

  onChangeTypePartenaire() {
    if (this.form.controls['type_partenaire'].value == 'PHAR') {
      this.form.get('code_specialite').setValue(null);
      this.form.get('code_specialite').disable();
      this.form.get('potentiel').setValue(null);
      this.form.get('potentiel').disable();
    } else {
      this.form.get('code_specialite').enable();
      this.form.get('potentiel').enable();
    }
  }

  selectVille(item) {
    this.listeVilles = item.villes ? item.villes : [];
    this.listeSecteurs = [];
    this.form.get('code_ville').setValue(null);
    this.form.get('code_secteur').setValue(null);

    if (this.listeVilles?.length == 0 || !this.listeVilles) {
      this.form.get('code_ville').disable();
      this.form.get('code_secteur').disable();
    } else {
      this.form.get('code_ville').enable();
      this.form.get('code_secteur').enable();
    }
  }

  selectSecteur(item) {
    this.listeSecteurs = item.secteurs ? item.secteurs : [];
    this.form.get('code_secteur').setValue(null);

    if (this.listeSecteurs?.length == 0 || !this.listeSecteurs) {
      this.form.get('code_secteur').disable();
    } else {
      this.form.get('code_secteur').enable();
    }
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
