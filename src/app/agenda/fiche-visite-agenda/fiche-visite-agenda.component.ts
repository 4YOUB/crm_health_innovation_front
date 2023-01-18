import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import { AgendaService } from 'app/service/agenda-service/agenda.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { VisiteService } from 'app/service/visite-service/visite.service';
import { CurrentUserService } from 'app/service/current-user.service';
import { ParamsAppService } from 'app/service/params-app-service/params-app.service';
import { AjouterVisiteComponent } from 'app/visite/ajouter-visite/ajouter-visite.component';

@Component({
  selector: 'ms-fiche-visite-agenda',
  templateUrl: './fiche-visite-agenda.component.html',
  styleUrls: ['./fiche-visite-agenda.component.scss']
})
export class FicheVisiteAgendaComponent implements OnInit {

  userItem: any = {};
  id_visite
  itemVisite: any = {};
  listeProduits = []
  partenaires = []
  isLoading = false
  date_jour
  jourPassRapportAdd
  jourPassRapportModif
  constructor(
    public dialogRef: MatDialogRef<FicheVisiteAgendaComponent>,
    private agendaService: AgendaService,
    private visiteService: VisiteService,
    private currentUserService: CurrentUserService,
    private paramsAppService: ParamsAppService,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.paramsAppService.get().then((params: any) => {
      this.jourPassRapportAdd = Number(params["JRRP"]["JRPASSRPADD"]);
      this.jourPassRapportModif = Number(params["JRRP"]["JRPASSRPMOD"]);
    });
    this.getFicheVisite();
    this.currentUserService.getInfos()
      .subscribe((res: any) => {
        this.date_jour = moment(res.date_jour).format('YYYY-MM-DD HH:mm');
      }, err => {
      })
  }



  getFicheVisite() {
    this.isLoading = true;
    this.visiteService.visitePartenaires(this.id_visite)
      .subscribe(res => {
        this.partenaires = res
      })
    this.agendaService.getFicheVisiteAgenda(this.id_visite)
      .subscribe((res: any) => {
        this.itemVisite = res.visite;
        this.listeProduits = res.visite?.produits;
        this.isLoading = false;

      }, err => {
        // this.showMessageError();
      })
  }
  addTminutes(date_visite) {
    return moment(date_visite, 'YYYY-MM-DD HH:mm:ss').add(30, 'm').format('HH:mm')
  }
  getTime(heure_fin_visite) {
    const heureFin_visite = moment(heure_fin_visite, 'HH:mm:ss').format('HH:mm')
    return heureFin_visite === 'Invalid date' ? null : heureFin_visite
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
      this.getFicheVisite()
    })
  }
}
