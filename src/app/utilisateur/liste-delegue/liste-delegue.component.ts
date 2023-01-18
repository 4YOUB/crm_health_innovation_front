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
import * as moment from 'moment';
import Swal from 'sweetalert2';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Objets par page';

  return customPaginatorIntl;
}
@Component({
  selector: 'ms-liste-delegue',
  templateUrl: './liste-delegue.component.html',
  styleUrls: ['./liste-delegue.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class ListeDelegueComponent implements OnInit {

  isLoading
  totalUtilisateurs
  listeUtilisateurs = []
  listeRevis = []
  listeGammes = []
  roles = ['ADMI','DIR','PM','DRG','DSM','KAM','DEL','ACH']
  form: FormGroup;
  userItem
  pageSize = 10
  pageIndex = 0
  isExporting = false;
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
      this.pageTitleService.setTitle("Liste Délégués");
    }, 0);
    this.initForm()
    this.getDelegues(this.pageSize, this.pageIndex)
    this.getRevis()
    this.getGammes()
  }

  initForm() {
    this.form = this.formBuilder.group({
      nom_utilisateur: [null],
      role: [null],
      email: [null],
      telephone: [null],
      code_gamme: [null],
      code_region: [null],
    });
    if(this.userItem.role == 'KAM')
    this.form.get('role').disable();
  }

  reset() {
    this.form.reset();
    this.pageIndex = 0
    this.getDelegues(this.pageSize, this.pageIndex)
  }

  filtrer() {
    this.pageIndex = 0
    this.getDelegues(this.pageSize, this.pageIndex)
  }
    
  type_tri
  order_by
  optionTri(event){
    this.type_tri = event?.type_tri
    this.order_by = event?.order_by
    this.getDelegues(this.pageSize, this.pageIndex)
  }

  getDelegues(records_per_page, page_number) {
    this.isLoading = true;
    this.listeUtilisateurs = []

    const body = {
      nom_utilisateur: this.form.controls['nom_utilisateur'].value,
      role: this.form.controls['role'].value,
      email: this.form.controls['email'].value ,
      telephone: this.form.controls['telephone'].value ,
      code_gamme: this.form.controls['code_gamme'].value?.length ? this.form.controls['code_gamme'].value : null,
      code_region: this.form.controls['code_region'].value,
      order_by: this.order_by,
      type_tri: this.type_tri 
    };

    this.utilisateurService.getDelegues(records_per_page, page_number, body)
      .subscribe((res: any) => {
        this.listeUtilisateurs = res.delegues;
        this.totalUtilisateurs = res.nbr_total_delegues;
        this.isLoading = false;
      }, err => {
        // this.showMessageError();
        this.isLoading = false;
      })

  }

  openDialog(data,mode,nom_utilisateur): void {
		const dialogRef = this.dialog.open(ModalUserComponent, {
			width: '400px',
			autoFocus: false,
      maxHeight: '90vh'
		});
    dialogRef.componentInstance.listeUser = data;
    dialogRef.componentInstance.mode = mode;
    dialogRef.componentInstance.nom_utilisateur = nom_utilisateur;
	}

  openDialogHistorique(id_utilisateur,nom_utilisateur): void {
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

  getNextPage(event) {
    this.pageSize = event.pageSize
    this.pageIndex = event.pageIndex
    this.getDelegues(event.pageSize, event.pageIndex)
  }

  exportDelegues(){
    this.isExporting = true;
    const body = {
      nom_utilisateur: this.form.controls['nom_utilisateur'].value,
      role: this.form.controls['role'].value,
      email: this.form.controls['email'].value ,
      telephone: this.form.controls['telephone'].value ,
      code_gamme: this.form.controls['code_gamme'].value?.length ? this.form.controls['code_gamme'].value : null,
      code_region: this.form.controls['code_region'].value,
      order_by: this.order_by,
      type_tri: this.type_tri 
    }
    this.utilisateurService.exportDelegues(body)
      .subscribe((res: any) => {

        const filename = `Delegues_${moment(new Date()).format("YYYY-MM-DD_HH-mm")}.xlsx`;
        let dataType = res.type;
        let binaryData = [];
        binaryData.push(res);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        if (filename) downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();

        this.isExporting = false;

      }, err => {
        this.isExporting = false;
        if(err.status == 403){
          Swal.fire({
            icon: "warning",
            text: `Désolé, Vous n'êtes pas autorisé à faire cette opération !`,
            showConfirmButton: false,
            heightAuto: false,
            timer: 2500,
          });
        }
        else{
          this.showMessageError();
        }
      })


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
