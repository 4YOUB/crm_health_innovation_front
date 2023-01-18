import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PageTitleService } from 'app/core/page-title/page-title.service';
import { CurrentUserService } from 'app/service/current-user.service';
import { PlanificationService } from 'app/service/planification-service/planification.service';
import { FicheVisiteComponent } from 'app/visite/fiche-visite/fiche-visite.component';

@Component({
  selector: 'ms-fiche-planification',
  templateUrl: './fiche-planification.component.html',
  styleUrls: ['./fiche-planification.component.scss']
})
export class FichePlanificationComponent implements OnInit {
  isLoading
  totalPlanification
  listePartenairesPlanifies = []
  listeSemaines = []
  listeUtilisateurs = []
  listeVilles = []
  sem_actuelle
  form: FormGroup;
  userItem
  id_planification
  nbr_med_planifies: any;
  nbr_phrama_planifiees: any;
  nom_utilisateur;

  constructor(
    private formBuilder: FormBuilder,
    private pageTitleService: PageTitleService,
    private _currentUser: CurrentUserService,
    private planificationService: PlanificationService,
    public dialog: MatDialog,
    private route: ActivatedRoute) {
    this.userItem = this._currentUser.getRoleCurrentUser();
    this.id_planification = this.route.snapshot.paramMap.get('id_planification');
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.pageTitleService.setTitle("Fiche Planification");
    }, 0);
    this.initForm()
    this.getVisite()
  }


  initForm() {
    this.form = this.formBuilder.group({
      liste_semaines: [null],
      id_utilisateur: [null],
    });

  }

  reset() {
    this.form.reset();
    this.getVisite()
  }

  filtrer() {
    this.getVisite()
  }

  getVisite() {
    this.isLoading = true;
    this.listePartenairesPlanifies = []

    this.planificationService.getFichePlanification(this.id_planification)
      .subscribe((res: any) => {
        this.listePartenairesPlanifies = res.partenaires;
        this.nbr_med_planifies = res.nbr_med_planifies;
        this.nbr_phrama_planifiees = res.nbr_phrama_planifiees;
        this.nom_utilisateur = res.nom_utilisateur;
        this.sem_actuelle = {
          date_debut: res.date_deb_planification,
          date_fin: res.date_fin_planification
        }
        this.isLoading = false;
      }, err => {
        // this.showMessageError();
        this.isLoading = false;
      })

  }

  openDialogFicheVisite(id_visite): void {
    const dialogRef = this.dialog.open(FicheVisiteComponent, {
      width: '900px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.userItem = this.userItem;
    dialogRef.componentInstance.id_visite = id_visite;
  }

}
