import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTitleService } from 'app/core/page-title/page-title.service';
import { CurrentUserService } from 'app/service/current-user.service';
import { PartenaireService } from 'app/service/partenaire-service/partenaire.service';
import Swal from 'sweetalert2';
import { AjouterPartenaireComponent } from '../ajouter-partenaire/ajouter-partenaire.component';

@Component({
  selector: 'ms-fiche-partenaire',
  templateUrl: './fiche-partenaire.component.html',
  styleUrls: ['./fiche-partenaire.component.scss']
})
export class FichePartenaireComponent implements OnInit {
  userItem
  itemPartenaire: any = {};
  idPartenaire
  statutPartenaire
  constructor(private partenaireService: PartenaireService,
    private pageTitleService: PageTitleService,
    private _currentUser: CurrentUserService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,) {
    this.userItem = this._currentUser.getRoleCurrentUser();
    this.idPartenaire = this.route.snapshot.paramMap.get('id_partenaire');
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.pageTitleService.setTitle("Fiche Compte");
    }, 0);
    this.getFichePartenaire()
  }

  getFichePartenaire() {
    this.partenaireService.getFichePartenaire(this.idPartenaire)
      .subscribe((res: any) => {
        if (res?.flag_disponible == 'N' || res?.partenaire.length == 0) {
          this.router.navigate(['/partenaires']);
        } else {
          this.itemPartenaire = res.partenaire[0] ? res.partenaire[0] : {};
          this.statutPartenaire = res.partenaire[0].code_statut_partenaire;
        }
      }, err => {
        // this.showMessageError();
      })
  }
  openDialogModifierPartenaire(): void {
    const dialogRef = this.dialog.open(AjouterPartenaireComponent, {
      width: '800px',
      autoFocus: false,
      maxHeight: '90vh'
    });

    dialogRef.componentInstance.mode = 'modifier';
    dialogRef.componentInstance.userItem = this.userItem;
    dialogRef.componentInstance.idPartenaire = this.idPartenaire;
    dialogRef.componentInstance.itemPartenaire = this.itemPartenaire;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getFichePartenaire()
        // ok Valider
      }
    })
  }
  resetData(event) {
    if (event == true)
      this.getFichePartenaire()
  }
  actionPartenaire(data_mode): void {
    switch (data_mode) {
      case 'DESA':
        Swal.fire({
          text: "Êtes-vous sûr de vouloir désactiver ce compte?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'var(--princ-health-color)',
          cancelButtonColor: '#b4b2b2',
          confirmButtonText: 'Rejeter',
          cancelButtonText: 'Annuler',
          heightAuto: false,
        }).then((result) => {
          if (result.value) {
            this.oerationEnCours()
            this.partenaireService.desactiverPartenaire(this.idPartenaire).subscribe(res => {
              this.getFichePartenaire();
              this.showMessageSuccess('désactivé')
            }, err => {
              this.showMessageError();
            })
          }
        })
        break;
      case 'ACTI':
        Swal.fire({
          text: "Êtes-vous sûr de vouloir activer ce compte?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'var(--princ-health-color)',
          cancelButtonColor: '#b4b2b2',
          confirmButtonText: 'Valider',
          cancelButtonText: 'Annuler',
          heightAuto: false,
        }).then((result) => {
          if (result.value) {
            this.oerationEnCours()
            this.partenaireService.activerPartenaire(this.idPartenaire).subscribe(success => {
              if (success?.done == false) {
                this.showMessageErrorValidation();
              } else {
                this.getFichePartenaire();
                this.showMessageSuccess('activé');
              }
            }, err => {
              this.showMessageError();
            })
          }
        })
        break;
      default: break;
    }
  }

  oerationEnCours() {
    Swal.fire({
      title: 'Opération est en cours!',
      heightAuto: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
  }

  showMessageSuccess(msg) {
    Swal.fire({
      icon: 'success',
      text: `Ce compte a été ` + msg + ` avec succès`,
      showConfirmButton: true,
      heightAuto: false,
      timer: 3500
    });
  }
  showMessageError() {
    Swal.fire({
      icon: 'error',
      text: `une erreur s'est produite. veuillez réessayer ultérieurement.`,
      showConfirmButton: false,
      heightAuto: false,
      timer: 2500,
    });
  }

  showMessageErrorValidation() {
    Swal.fire({
      icon: 'error',
      text: `Veuillez remplir tous les champs pour pouvoir valider le partenaire`,
      showConfirmButton: false,
      heightAuto: false,
      timer: 2500,
    });
  }
}
