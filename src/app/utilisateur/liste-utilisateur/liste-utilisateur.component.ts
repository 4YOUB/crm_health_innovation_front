import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageTitleService } from 'app/core/page-title/page-title.service';
import { CurrentUserService } from 'app/service/current-user.service';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import { UtilisateurService } from 'app/service/utilisateur-service/utilisateur.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ModalUserComponent } from '../modal-user/modal-user.component';
import { HistoriqueUserComponent } from '../historique-user/historique-user.component';
import Swal from 'sweetalert2';
import { AjouterUtilisateurComponent } from '../ajouter-utilisateur/ajouter-utilisateur.component';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Objets par page';

  return customPaginatorIntl;
}
@Component({
  selector: 'ms-liste-utilisateur',
  templateUrl: './liste-utilisateur.component.html',
  styleUrls: ['./liste-utilisateur.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ListeUtilisateurComponent implements OnInit {

  isLoading
  totalUtilisateurs
  listeUtilisateurs = []
  listeRevis = []
  listeGammes = []
  roles = ['ADMI', 'DIR', 'PM', 'DRG', 'DSM', 'KAM', 'DEL', 'ACH']
  form: FormGroup;
  userItem
  pageSize = 10
  pageIndex = 0
  constructor(
    private utilisateurService: UtilisateurService,
    private formBuilder: FormBuilder,
    private pageTitleService: PageTitleService,
    private _currentUser: CurrentUserService,
    public dialog: MatDialog,
    private listeCodifService: ListeCodifService) {
    this.userItem = this._currentUser.getRoleCurrentUser();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.pageTitleService.setTitle("Liste Utilisateurs");
    }, 0);
    this.initForm()
    this.getUtilisateur(this.pageSize, this.pageIndex)
    this.getRevis()
    this.getGammes()
  }

  openDialogAjouterUtilisateur(): void {
    const dialogRef = this.dialog.open(AjouterUtilisateurComponent, {
      width: '800px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.userItem = this.userItem;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reset()
        // ok Valider
      }
    })
  }

  openDialogModifierUtilisateur(mode?, id_utilisateur?, item?): void {
    const dialogRef = this.dialog.open(AjouterUtilisateurComponent, {
      width: '800px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.id_utilisateur = id_utilisateur;
    dialogRef.componentInstance.mode = mode;
    dialogRef.componentInstance.itemUtilisateur = item;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reset()
        // ok Valider
      }
    })
  }

  initForm() {
    this.form = this.formBuilder.group({
      nom_utilisateur: [null],
      role: [null],
      email: [null],
      telephone: [null],
      code_statut_utilisateur: [null],
      code_gamme: [null],
      code_region: [null],
    });

  }

  reset() {
    this.form.reset();
    this.pageIndex = 0
    this.getUtilisateur(this.pageSize, this.pageIndex)
  }

  filtrer() {
    this.pageIndex = 0
    this.getUtilisateur(this.pageSize, this.pageIndex)
  }

  type_tri
  order_by
  optionTri(event) {
    this.type_tri = event?.type_tri
    this.order_by = event?.order_by
    this.getUtilisateur(this.pageSize, this.pageIndex)
  }

  getUtilisateur(records_per_page, page_number) {
    this.isLoading = true;
    this.listeUtilisateurs = []

    const body = {
      nom_utilisateur: this.form.controls['nom_utilisateur'].value,
      role: this.form.controls['role'].value,
      email: this.form.controls['email'].value,
      telephone: this.form.controls['telephone'].value,
      code_statut_utilisateur: this.form.controls['code_statut_utilisateur'].value,
      code_gamme: this.form.controls['code_gamme'].value,
      code_region: this.form.controls['code_region'].value,
      order_by: this.order_by,
      type_tri: this.type_tri
    };

    this.utilisateurService.getUtilisateur(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listeUtilisateurs = res.utilisateurs;
        this.totalUtilisateurs = res.nbr_total_utilisateurs;
        this.isLoading = false;
      }, err => {
        // this.showMessageError();
        this.isLoading = false;
      })

  }

  openDialog(data, mode, nom_utilisateur): void {
    const dialogRef = this.dialog.open(ModalUserComponent, {
      width: '400px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.listeUser = data;
    dialogRef.componentInstance.mode = mode;
    dialogRef.componentInstance.nom_utilisateur = nom_utilisateur;
  }

  openDialogHistorique(id_utilisateur, nom_utilisateur): void {
    const dialogRef = this.dialog.open(HistoriqueUserComponent, {
      width: '700px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.id_utilisateur = id_utilisateur;
    dialogRef.componentInstance.nom_utilisateur = nom_utilisateur;
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

  actionUtilisateur(data_mode, id_utilisateur): void {
    switch (data_mode) {
      case 'DESA':
        Swal.fire({
          text: "Êtes-vous sûr de vouloir désactiver cet utilisateur?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'var(--princ-health-color)',
          cancelButtonColor: '#b4b2b2',
          confirmButtonText: 'Désactiver',
          cancelButtonText: 'Annuler',
          heightAuto: false,
        }).then((result) => {
          if (result.value) {
            this.operationEnCours()
            this.utilisateurService.desactiverUtilisateur(id_utilisateur).subscribe(res => {
              this.getUtilisateur(this.pageSize, this.pageIndex)
              this.showMessageSuccess('désactivé')
            }, err => {
              this.showMessageError();
            })
          }
        })
        break;
      case 'ACTI':
        Swal.fire({
          text: "Êtes-vous sûr de vouloir activer cet utilisateur?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'var(--princ-health-color)',
          cancelButtonColor: '#b4b2b2',
          confirmButtonText: 'Activer',
          cancelButtonText: 'Annuler',
          heightAuto: false,
        }).then((result) => {
          if (result.value) {
            this.operationEnCours()
            this.utilisateurService.activerUtilisateur(id_utilisateur).subscribe(res => {
              this.getUtilisateur(this.pageSize, this.pageIndex)
              this.showMessageSuccess('activé')
            }, err => {
              this.showMessageError();
            })
          }
        })
        break;
      default: break;
    }
  }

  operationEnCours() {
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
      text: `Cet utilisateur a été ` + msg + ` avec succès`,
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

  getNextPage(event) {
    this.pageSize = event.pageSize
    this.pageIndex = event.pageIndex
    this.getUtilisateur(event.pageSize, event.pageIndex)
  }

}
