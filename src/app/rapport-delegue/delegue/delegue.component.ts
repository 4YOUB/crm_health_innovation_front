import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PageTitleService } from 'app/core/page-title/page-title.service';
import { CurrentUserService } from 'app/service/current-user.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { RapportDelegueService } from '../../service/rapport-delegue/rapport-delegue.service'
import { DescriptionRowComponent } from '../description-row/description-row.component';
@Component({
  selector: 'ms-delegue',
  templateUrl: './delegue.component.html',
  styleUrls: ['./delegue.component.scss']
})
export class DelegueComponent implements OnInit {

  constructor(private rapportDelegueService: RapportDelegueService,
    private pageTitleService: PageTitleService,
    private curreuntUserService: CurrentUserService,
    private dialog: MatDialog) {
    this.roles = {
      'DIR': true,
      'DRG': true,
      'PM': true,
      'DSM': true,
      'KAM': true,
      'DEL': true
    }
    this.userItem = this.curreuntUserService.getRoleCurrentUser()
    this.currentUserRole = this.userItem.role
  }
  currentUserRole
  months = { 1: 'Janvier', 2: 'Fevrier', 3: 'Mars', 4: 'Avril', 5: 'May', 6: 'Juin', 7: 'Juillet', 8: 'Aout', 9: 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Decembre' }
  displayedColumns: string[] = ['nom_delegue', 'visites', 'Janvier', 'Fevrier', 'Mars', 'Avril', 'May', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre', 'Total', 'Moyenne'];
  displayedColums: string[] = ['nom_delegue_working', 'working_day', 'Janvier_working', 'Fevrier_working', 'Mars_working', 'Avril_working', 'May_working', 'Juin_working', 'Juillet_working', 'Aout_working', 'Septembre_working', 'Octobre_working', 'Novembre_working', 'Decembre_working', 'Total_working', 'Moyenne_working'];
  displayedCol: string[] = ['nom_delegue_average', 'Average_Call', 'Janvier_average', 'Fevrier_average', 'Mars_average', 'Avril_average', 'May_average', 'Juin_average', 'Juillet_average', 'Aout_average', 'Septembre_average', 'Octobre_average', 'Novembre_average', 'Decembre_average', 'Total_average', 'Moyenne_average'];
  nbr_visites_plan_columns: string[] = ['nom_utilisateur_nbr_visites_plan', 'nbr_visites_plan', 'Janvier_nbr_visites_plan', 'Fevrier_nbr_visites_plan', 'Mars_nbr_visites_plan', 'Avril_nbr_visites_plan', 'May_nbr_visites_plan', 'Juin_nbr_visites_plan', 'Juillet_nbr_visites_plan', 'Aout_nbr_visites_plan', 'Septembre_nbr_visites_plan', 'Octobre_nbr_visites_plan', 'Novembre_nbr_visites_plan', 'Decembre_nbr_visites_plan', 'Total_nbr_visites_plan', 'Moyenne_nbr_visites_plan'];
  nbr_visites_hors_plan_columns: string[] = ['nom_utilisateur_nbr_visites_hors_plan', 'nbr_visites_hors_plan', 'Janvier_nbr_visites_hors_plan', 'Fevrier_nbr_visites_hors_plan', 'Mars_nbr_visites_hors_plan', 'Avril_nbr_visites_hors_plan', 'May_nbr_visites_hors_plan', 'Juin_nbr_visites_hors_plan', 'Juillet_nbr_visites_hors_plan', 'Aout_nbr_visites_hors_plan', 'Septembre_nbr_visites_hors_plan', 'Octobre_nbr_visites_hors_plan', 'Novembre_nbr_visites_hors_plan', 'Decembre_nbr_visites_hors_plan', 'Total_nbr_visites_hors_plan', 'Moyenne_nbr_visites_hors_plan'];
  nbr_visites_total_columns: string[] = ['nom_utilisateur_nbr_visites_total', 'nbr_visites_total', 'Janvier_nbr_visites_total', 'Fevrier_nbr_visites_total', 'Mars_nbr_visites_total', 'Avril_nbr_visites_total', 'May_nbr_visites_total', 'Juin_nbr_visites_total', 'Juillet_nbr_visites_total', 'Aout_nbr_visites_total', 'Septembre_nbr_visites_total', 'Octobre_nbr_visites_total', 'Novembre_nbr_visites_total', 'Decembre_nbr_visites_total', 'Total_nbr_visites_total', 'Moyenne_nbr_visites_total'];
  nbr_delegues_actifs_columns: string[] = ['nom_utilisateur_nbr_delegues_actifs', 'nbr_delegues_actifs', 'Janvier_nbr_delegues_actifs', 'Fevrier_nbr_delegues_actifs', 'Mars_nbr_delegues_actifs', 'Avril_nbr_delegues_actifs', 'May_nbr_delegues_actifs', 'Juin_nbr_delegues_actifs', 'Juillet_nbr_delegues_actifs', 'Aout_nbr_delegues_actifs', 'Septembre_nbr_delegues_actifs', 'Octobre_nbr_delegues_actifs', 'Novembre_nbr_delegues_actifs', 'Decembre_nbr_delegues_actifs', 'Total_nbr_delegues_actifs', 'Moyenne_nbr_delegues_actifs'];
  moyenne_visites_columns: string[] = ['nom_utilisateur_moyenne_visites', 'moyenne_visites', 'Janvier_moyenne_visites', 'Fevrier_moyenne_visites', 'Mars_moyenne_visites', 'Avril_moyenne_visites', 'May_moyenne_visites', 'Juin_moyenne_visites', 'Juillet_moyenne_visites', 'Aout_moyenne_visites', 'Septembre_moyenne_visites', 'Octobre_moyenne_visites', 'Novembre_moyenne_visites', 'Decembre_moyenne_visites', 'Total_moyenne_visites', 'Moyenne_moyenne_visites'];
  nbr_jour_non_travaille: string[] = ['nom_utilisateur_nbr_jour_non_travaille', 'nbr_jour_non_travaille', 'Janvier_nbr_jour_non_travaille', 'Fevrier_nbr_jour_non_travaille', 'Mars_nbr_jour_non_travaille', 'Avril_nbr_jour_non_travaille', 'May_nbr_jour_non_travaille', 'Juin_nbr_jour_non_travaille', 'Juillet_nbr_jour_non_travaille', 'Aout_nbr_jour_non_travaille', 'Septembre_nbr_jour_non_travaille', 'Octobre_nbr_jour_non_travaille', 'Novembre_nbr_jour_non_travaille', 'Decembre_nbr_jour_non_travaille', 'Total_nbr_jour_non_travaille', 'Moyenne_nbr_jour_non_travaille'];
  nbr_jour_travaille: string[] = ['nom_utilisateur_nbr_jour_travaille', 'nbr_jour_travaille', 'Janvier_nbr_jour_travaille', 'Fevrier_nbr_jour_travaille', 'Mars_nbr_jour_travaille', 'Avril_nbr_jour_travaille', 'May_nbr_jour_travaille', 'Juin_nbr_jour_travaille', 'Juillet_nbr_jour_travaille', 'Aout_nbr_jour_travaille', 'Septembre_nbr_jour_travaille', 'Octobre_nbr_jour_travaille', 'Novembre_nbr_jour_travaille', 'Decembre_nbr_jour_travaille', 'Total_nbr_jour_travaille', 'Moyenne_nbr_jour_travaille'];
  moyen_jour_travaille: string[] = ['nom_utilisateur_moyen_jour_travaille', 'moyen_jour_travaille', 'Janvier_moyen_jour_travaille', 'Fevrier_moyen_jour_travaille', 'Mars_moyen_jour_travaille', 'Avril_moyen_jour_travaille', 'May_moyen_jour_travaille', 'Juin_moyen_jour_travaille', 'Juillet_moyen_jour_travaille', 'Aout_moyen_jour_travaille', 'Septembre_moyen_jour_travaille', 'Octobre_moyen_jour_travaille', 'Novembre_moyen_jour_travaille', 'Decembre_moyen_jour_travaille', 'Total_moyen_jour_travaille', 'Moyenne_moyen_jour_travaille'];
  moyenne_columns: string[] = ['nom_utilisateur_moyenne', 'moyenne', 'Janvier_moyenne', 'Fevrier_moyenne', 'Mars_moyenne', 'Avril_moyenne', 'May_moyenne', 'Juin_moyenne', 'Juillet_moyenne', 'Aout_moyenne', 'Septembre_moyenne', 'Octobre_moyenne', 'Novembre_moyenne', 'Decembre_moyenne', 'Total_moyenne', 'Moyenne_moyenne'];
  roles
  dataSource = new MatTableDataSource<any>();
  filteredDataSource = new MatTableDataSource<any>()
  totalDataSource
  id_responsable
  annee
  listeAnnee = []
  listeResponsables = []
  joursParMois = {}
  joursPasse = {}
  tableData
  isLoading = false
  isReduit = true
  userItem
  isExporting = false
  ngOnInit() {
    this.annee = moment().year()
    this.isLoading = true
    this.rapportDelegueService.getRapportAnnuel({}).subscribe(res => { this.tableData = res; this.initJoursParMois(); this.rapportAnnuelInit(res); this.isLoading = false })
    this.rapportDelegueService.getSubUsers().subscribe(res => { this.listeResponsables = res.sub })
    this.rapportDelegueService.getAnneExiste().subscribe(res => this.listeAnnee = res.annees)
    setTimeout(() => {
      this.pageTitleService.setTitle("Taux de couverture");
    }, 0);
  }

  initJoursParMois() {
    this.tableData.nbr_jours_ouvrables.forEach(elem => {
      const evenementsGlobalKey = Object.keys(this.tableData.liste_evenements_globals).find(el => Number(el.split('_')[el.split('_').length - 1]) == elem.mois)
      this.joursParMois[this.months[elem.mois]] = Math.max(elem.nbr_jours_ouvrables - this.tableData.liste_evenements_globals[evenementsGlobalKey] || 0, 0)
      this.joursPasse[this.months[elem.mois]] = elem.jours_passe
    })
  }
  setReduit() {
    this.isReduit = !this.isReduit
  }
  rapportAnnuelInit(res) {
    // const t = []
    // res.statistiques.forEach((data, index) => {
    //   const userIndex = t.findIndex(el =>
    //     el.id_utilisateur === data.id_utilisateur
    //   )
    //   if (userIndex !== -1) {
    //     t[userIndex].visites_plan[this.months[data.mois]] = (data.nbr_visites_plan || 0)
    //     t[userIndex].visites_hors_plan[this.months[data.mois]] = (data.nbr_visites_horsplan || 0)
    //     t[userIndex].jours_nonTravaille[this.months[data.mois]] = (data.nbr_jours_nonTravaille || 0)
    //     t[userIndex].delegues_actifs[this.months[data.mois]] = data.flag_actif
    //   } else {
    //     const userData = {
    //       id_utilisateur: data.id_utilisateur,
    //       nom_utilisateur: data.nom_utilisateur,
    //       date_creation: moment(data.date_creation, 'YYYY-MM-DD').format('DD/MM/YYYY'),
    //       visites_plan: {},
    //       visites_hors_plan: {},
    //       jours_nonTravaille: {},
    //       delegues_actifs: {}
    //     }
    //     userData.visites_plan[this.months[data.mois]] = (data.nbr_visites_plan || 0)
    //     userData.visites_hors_plan[this.months[data.mois]] = (data.nbr_visites_horsplan || 0)
    //     userData.jours_nonTravaille[this.months[data.mois]] = (data.nbr_jours_nonTravaille || 0)
    //     userData.delegues_actifs[this.months[data.mois]] = data.flag_actif
    //     t.push(userData)

    //   }

    // })
    // this.dataSource.data = t

    // this.dataSource.data.forEach(data => {
    //   Object.keys(this.months).forEach(k => {
    //     if (!Object.keys(data.visites_plan).includes(this.months[k])) {
    //       data.visites_plan[this.months[k]] = 0
    //     }
    //     if (!Object.keys(data.visites_hors_plan).includes(this.months[k])) {
    //       data.visites_hors_plan[this.months[k]] = 0
    //     }
    //     if (!Object.keys(data.jours_nonTravaille).includes(this.months[k])) {
    //       data.jours_nonTravaille[this.months[k]] = 0
    //     }
    //     if (!Object.keys(data.delegues_actifs).includes(this.months[k])) {
    //       data.delegues_actifs[this.months[k]] = 'N'
    //     }
    //   })
    // })
    this.dataSource.data = res.statistiques
    this.dataSource.data.forEach(user => {
      user.visites_plan = {}
      user.visites_hors_plan = {}
      user.delegues_actifs = {}
      user.jours_nonTravaille = {}
      Object.keys(user).forEach(data => {
        let splited = data.split('_')
        let key = splited.slice(0, splited.length - 1).join('_')
        let month = splited[splited.length - 1]
        let currentMoment = moment().set('M', Number(month) - 1);
        let dayCreation = Number(moment(user.date_creation).format('DD'))
        let yearCreation = Number(moment(user.date_creation).format('YYYY'))
        if (key === 'nbr_visites_plan') {
          user.visites_plan[this.months[Number(month)]] = user[data]
        }
        if (key === 'nbr_visites_horsplan') {
          user.visites_hors_plan[this.months[Number(month)]] = user[data]
        }
        if (key === 'flag_actif') {
          user.delegues_actifs[this.months[Number(month)]] = user[data]
        }
        if (key === 'nbr_evenements') {
          user.jours_nonTravaille[this.months[Number(month)]] = user[data]
          let date_creation = moment(user.date_creation).format('YYYY-MM-DD'),
            firstDayOfMonth = currentMoment.set('D', 1).year(this.annee || moment().year()).format('YYYY-MM-DD'),
            lastDayOfMonth = currentMoment.set('D', currentMoment.daysInMonth()).year(this.annee || moment().year()).format('YYYY-MM-DD')
          if (moment(date_creation, 'YYYY-MM-DD').isBetween(moment(firstDayOfMonth, 'YYYY-MM-DD'), moment(lastDayOfMonth, 'YYYY-MM-DD'))) {
            let nbr_samedi = this.sunsatInMonth(6, Number(month), yearCreation, dayCreation)
            let nbr_dimanche = this.sunsatInMonth(0, Number(month), yearCreation, dayCreation)
            user.jours_nonTravaille[this.months[Number(month)]] += dayCreation - nbr_dimanche - nbr_samedi
            user.jours_nonTravaille[this.months[Number(month)]] = Math.max(user.jours_nonTravaille[this.months[Number(month)]], 0)
          }
        }
      })
    })
    // console.log(this.dataSource.data)
    this.dataSourceInit()
  }

  dataSourceInit() {
    this.dataSource.data.forEach(elem => {
      let total_visites_plan = 0,
        total_visites_hors_plan = 0,
        total_jours_nonTravaille = 0,
        total_jours_travaille = 0

      elem['jours_travaille'] = {}
      elem['visites_total'] = {}
      elem['Moyenne'] = {}
      for (let k in elem.visites_plan) {
        if (k !== 'Total' && k !== 'Moyenne') {
          if (elem.delegues_actifs[k] === 'O') {
            const evenementsGlobalKey = Object.keys(this.tableData.liste_evenements_globals).find(el => Number(el.split('_')[el.split('_').length - 1]) == Number(Object.keys(this.months).find(e => this.months[e] == k)))
            elem.visites_total[k] = elem.visites_plan[k] + elem.visites_hors_plan[k]
            elem.jours_travaille[k] = Math.max(this.joursPasse[k] - elem.jours_nonTravaille[k] - this.tableData.liste_evenements_globals[evenementsGlobalKey], 0)
            elem.Moyenne[k] = elem.jours_travaille[k] > 0 ? this.round(elem.visites_total[k] / elem.jours_travaille[k], 2) : 0
            total_visites_plan += elem.visites_plan[k]
            total_visites_hors_plan += elem.visites_hors_plan[k]
            total_jours_nonTravaille += elem.jours_nonTravaille[k]
            total_jours_travaille += elem.jours_travaille[k]
          } else {
            elem.visites_plan[k] = 0
            elem.visites_hors_plan[k] = 0
            elem.visites_total[k] = 0
            elem.jours_nonTravaille[k] = 0
            elem.jours_travaille[k] = 0
            elem.Moyenne[k] = 0
          }
        }
      }
      elem.visites_plan['Total'] = total_visites_plan
      elem.visites_hors_plan['Total'] = total_visites_hors_plan
      elem.jours_nonTravaille['Total'] = total_jours_nonTravaille
      elem.visites_total['Total'] = total_visites_plan + total_visites_hors_plan
      elem.jours_travaille['Total'] = total_jours_travaille
      elem.Moyenne['Total'] = elem.jours_travaille > 0 ? this.round(elem.visites_total.Total / elem.jours_travaille.Total, 2) : 0
      elem.date_creation = moment(elem.date_creation).format('YYYY-MM-DD')
    })
    this.filteredDataSource.data = this.dataSource.data
    this.totalDataSourceInit()
  }
  totalDataSourceInit() {
    this.totalDataSource = new MatTableDataSource<any>([{ "id_utilisateur": -1, "nom_utilisateur": "Total National" }])
    const dataInitial = { Janvier: 0, Fevrier: 0, Mars: 0, Avril: 0, May: 0, Juin: 0, Juillet: 0, Aout: 0, Septembre: 0, Octobre: 0, Novembre: 0, Decembre: 0 }
    this.totalDataSource.data[0]['visites_plan'] = { ...dataInitial }
    this.totalDataSource.data[0]['visites_hors_plan'] = { ...dataInitial }
    this.totalDataSource.data[0]['visites_total'] = { ...dataInitial }
    this.totalDataSource.data[0]['delegues_actifs'] = { ...dataInitial }
    this.totalDataSource.data[0]['visites_moyenne'] = { ...dataInitial }
    this.totalDataSource.data[0]['jours_nonTravaille'] = { ...dataInitial }
    this.totalDataSource.data[0]['jours_travaille'] = { ...dataInitial }
    this.totalDataSource.data[0]['jours_travaille_moyenne'] = { ...dataInitial }
    this.totalDataSource.data[0]['Moyenne'] = { ...dataInitial }

    this.filteredDataSource.data.forEach(elem => {
      for (let k in elem.visites_plan) {
        if (k !== 'Total' && k !== 'Moyenne' && k !== 'designation') {
          if (elem.delegues_actifs[k] === 'O') {
            this.totalDataSource.data[0].visites_plan[k] += elem.visites_plan[k]
            this.totalDataSource.data[0].visites_hors_plan[k] += elem.visites_hors_plan[k]
            this.totalDataSource.data[0].jours_nonTravaille[k] += elem.jours_nonTravaille[k]
            this.totalDataSource.data[0].jours_travaille[k] += elem.jours_travaille[k]
          }
        }
      }
    })
    let total_visites_plan = 0,
      total_visites_hors_plan = 0,
      total_jours_nonTravaille = 0,
      total_jours_travaille = 0
    for (let el in this.totalDataSource.data[0].visites_plan) {


      if (el !== 'Total' && el !== 'Moyenne' && el !== 'designation') {
        this.totalDataSource.data[0].visites_total[el] = this.totalDataSource.data[0].visites_plan[el] + this.totalDataSource.data[0].visites_hors_plan[el]
        this.totalDataSource.data[0].delegues_actifs[el] = this.dataSource.data.filter(elem => elem.delegues_actifs[el] === 'O').length
        this.totalDataSource.data[0].visites_moyenne[el] = this.totalDataSource.data[0].delegues_actifs[el] > 0 ? this.round(this.totalDataSource.data[0].visites_total[el] / this.totalDataSource.data[0].delegues_actifs[el], 1) : 0
        this.totalDataSource.data[0].jours_travaille_moyenne[el] = this.totalDataSource.data[0].delegues_actifs[el] > 0 ? this.round(this.totalDataSource.data[0].jours_travaille[el] / this.totalDataSource.data[0].delegues_actifs[el], 1) : 0
        this.totalDataSource.data[0].Moyenne[el] = this.totalDataSource.data[0].jours_travaille[el] > 0 ? this.round(this.totalDataSource.data[0].visites_total[el] / this.totalDataSource.data[0].jours_travaille[el], 2) : 0
        total_visites_plan += this.totalDataSource.data[0].visites_plan[el]
        total_visites_hors_plan += this.totalDataSource.data[0].visites_hors_plan[el]
        total_jours_nonTravaille += this.totalDataSource.data[0].jours_nonTravaille[el]
        total_jours_travaille += this.totalDataSource.data[0].jours_travaille[el]
      }
    }
    this.totalDataSource.data[0].visites_plan['Total'] = total_visites_plan
    this.totalDataSource.data[0].visites_hors_plan['Total'] = total_visites_hors_plan
    this.totalDataSource.data[0].visites_total['Total'] = total_visites_plan + total_visites_hors_plan
    this.totalDataSource.data[0].jours_nonTravaille['Total'] = total_jours_nonTravaille
    this.totalDataSource.data[0].jours_travaille['Total'] = total_jours_travaille
    this.totalDataSource.data[0].Moyenne['Total'] = this.round(this.totalDataSource.data[0].visites_total['Total'] / this.totalDataSource.data[0].jours_travaille['Total'], 2)
    this.filteredDataSource.data.forEach(elem => {
      elem.visites_plan['Moyenne'] = this.toPercentage(elem.visites_plan.Total, this.totalDataSource.data[0].visites_plan.Total)
      elem.visites_hors_plan['Moyenne'] = this.toPercentage(elem.visites_hors_plan.Total, this.totalDataSource.data[0].visites_hors_plan.Total)
      elem.visites_total['Moyenne'] = this.toPercentage(elem.visites_total.Total, this.totalDataSource.data[0].visites_total.Total)
      elem.jours_nonTravaille['Moyenne'] = this.toPercentage(elem.jours_nonTravaille.Total, this.totalDataSource.data[0].jours_nonTravaille.Total)
      elem.jours_travaille['Moyenne'] = this.toPercentage(elem.jours_travaille.Total, this.totalDataSource.data[0].jours_travaille.Total)
      elem.Moyenne['Moyenne'] = this.toPercentage(elem.Moyenne.Total, this.totalDataSource.data[0].Moyenne.Total)
      elem.jours_par_mois = this.joursParMois
    })
    this.totalDataSource.data[0].jours_par_mois = this.joursParMois
  }
  exportTauxCoverture() {
    this.isExporting = true
    const isRendu = {
      "Visites Totales réalisées": this.totalDataSource.data[0]?.visites_total,
      "Visites plannifiées": this.totalDataSource.data[0]?.visites_plan,
      "Visites Hors plan": this.totalDataSource.data[0]?.visites_hors_plan,
      "Délégués actifs": this.totalDataSource.data[0]?.delegues_actifs,
      "Jours Travaillés": this.totalDataSource.data[0]?.visites_moyenne,
      "Moyenne de visité Jour": this.totalDataSource.data[0]?.Moyenne,
    }
    const isEttendu = {
      "Nombre de jours par mois": this.totalDataSource.data[0]?.jours_par_mois,
      "Visites Totales réalisées": this.totalDataSource.data[0]?.visites_total,
      "Visites plannifiées": this.totalDataSource.data[0]?.visites_plan,
      "Visites Hors plan": this.totalDataSource.data[0]?.visites_hors_plan,
      "Délégués actifs": this.totalDataSource.data[0]?.delegues_actifs,
      "Jours Travaillés": this.totalDataSource.data[0]?.visites_moyenne,
      "Nombre de jours non travaillés": this.totalDataSource.data[0]?.jours_nonTravaille,
      "Nombre de jours travaillés": this.totalDataSource.data[0]?.jours_travaille,
      "Moyenne de jour travaillés": this.totalDataSource.data[0]?.jours_travaille_moyenne,
      "Moyenne de visité Jour": this.totalDataSource.data[0]?.Moyenne,
    }
    const delegueData = []
    this.filteredDataSource.data.forEach(delegue => {
      delegueData.push({
        nom_delegue: delegue?.nom_utilisateur,
        date_creation: delegue?.date_creation,
        "delegue_actifs": delegue?.delegues_actifs,
        "Nombre de jours par mois": delegue?.jours_par_mois,
        "Visites Totales réalisées": delegue?.visites_total,
        "Visites plannifiées": delegue?.visites_plan,
        "Visites Hors plan": delegue?.visites_hors_plan,
        "Nombre de jours non travaillés": delegue?.jours_nonTravaille,
        "Jours Travaillés": delegue?.jours_travaille,
        "Moyenne de visité Jour": delegue?.Moyenne
      })
    })
    this.rapportDelegueService.exportTauxCoverture({ totalData: this.isReduit ? isRendu : isEttendu, delegueData: delegueData, isReduit: this.isReduit, responsable: this.listeResponsables.find(el => el.id_utilisateur == this.id_responsable)?.nom_complet || this.userItem?.nom_prenom, annee: this.annee })
      .subscribe((res: any) => {
        this.isExporting = false
        const filename = `Taux_De_Coverture_${moment(new Date()).format("YYYY-MM-DD_HH-mm")}.xlsx`;
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

      }, err => {
        if (err.status == 403) {
          Swal.fire({
            icon: "warning",
            text: `Désolé, Vous n'êtes pas autorisé à faire cette opération !`,
            showConfirmButton: false,
            heightAuto: false,
            timer: 2500,
          });
        }
      })
  }
  getRapportAnnuel() {
    this.isLoading = true
    this.rapportDelegueService.getRapportAnnuel({
      "id_utilisateur": this.id_responsable,
      "annee": this.annee,
      "roles": Object.keys(this.roles).filter(role => !!this.roles[role])
    }).subscribe(res => {
      this.tableData = res;
      this.initJoursParMois();
      this.rapportAnnuelInit(res);
      this.isLoading = false
    })
  }
  isLastRole(role) {
    return Object.keys(this.roles).filter(e => this.roles[e]).length == 1 && this.roles[role]
  }
  toPercentage(num1, num2) {
    if (num1 && num2) return this.round((num1 / num2) * 100, 1) + '%'
    return 0
  }

  round(value, precision?) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
  openDialogueDescription(row, annee) {
    const dialogRef = this.dialog.open(DescriptionRowComponent, {
      width: '600px',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.componentInstance.row = row;
    dialogRef.componentInstance.annee = this.annee
  }
  sunsatInMonth(weekDayId, month, year, end = -1) {
    var day, counter, date;
    day = 1;
    counter = 0;
    date = new Date(year, month, day);
    while (date.getMonth() === month) {
      if (date.getDay() === weekDayId) {
        counter += 1;
      }
      day += 1;
      date = new Date(year, month, day);
      if (day === end) break;
    }
    return counter;
  }
}



