import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PageTitleService } from '../../core/page-title/page-title.service';
import { DashboardService } from 'app/service/dashboard-service/dashboard.service';
import * as moment from 'moment';
import { CurrentUserService } from 'app/service/current-user.service';
import { UtilisateurService } from 'app/service/utilisateur-service/utilisateur.service';

@Component({
	selector: 'ms-crm',
	templateUrl: './crm.component.html',
	styleUrls: ['./crm.component.scss']
})

export class CrmComponent implements OnInit, AfterViewInit {
	userItem;
	listeUtilisateurs = []
	id_utilisateur
	role
	nameFilterModel = 'Cette semaine'
	someName = [
		{
			name: 'Jour',
			data: [
				{ name: 'Hier', value: '1', momentd: 'd' },
				{ name: "Aujourd'hui", value: '2', momentd: 'd' }
			]
		},
		{
			name: 'Semaine',
			data: [
				{ name: 'Semaine dernière', value: '1', momentd: 'w' },
				{ name: 'Cette semaine', value: '2', momentd: 'w' }
			]
		},
		{
			name: 'Mois',
			data: [
				{ name: 'Mois dernier', value: '1', momentd: 'M' },
				{ name: 'Ce mois', value: '2', momentd: 'M' }
			]
		},
		{
			name: 'Année',
			data: [
				{ name: 'Année dernière', value: '1', momentd: 'y' },
				{ name: 'Cette année', value: '2', momentd: 'y' }
			]
		}
	];
	date_debut
	date_fin
	date_jour = moment(new Date()).format('YYYY-MM-DD')
	is_enabledPeriod = false;
	statistiques
	chart
	chartTab
	backgroundColor = ["#fea1b5", "#89c8f4", "#258387", "#2fddce", "#19477d", "#7655c7", "#ec4dd8", "#4b85d2", "#63ef85", "#1d8a20", "#c2dcb8", "#859947", "#c0e15c", "#6e3901", "#d2642c", "#8e1023", "#f8d147", "#fc2c44", "#374e07", "#bb8801", "#bb8801", "#374e07", "#6ae7e6", "#274c56", "#b2cad9", "#1f4196", "#e376d4", "#7780b7", "#8d2973", "#f3c5fa", "#4f28af", "#74ce4b", "#738c4e", "#bbcf7a", "#048a37", "#2f8fa5", "#09f54c", "#73350e", "#df5922", "#f4d403"]
	pieChartColors: any[] = [{
		backgroundColor: this.backgroundColor
	}];

	PieChartOptions: any = {
		maintainAspectRatio: true,
		// cutoutPercentage: 70,
		responsive: false,
		// elements: {
		// 	arc: {
		// 		borderWidth: 0
		// 	}
		// },
		legend: {
			display: false,
			position: 'right',
			labels: {
				fontWeight: "bold",
				fontSize: 15,
				usePointStyle: true,
			}
		}

	}
	public doughnutChartPlugin = [
		{
			beforeDraw: function (chart) {
				var data = chart.data.datasets[0].data;
				var sum = data.reduce(function (a, b) {
					return a + b;
				}, 0);
				var width = chart.chart.width,
					height = chart.chart.height,
					ctx = chart.chart.ctx;
				ctx.restore();
				var fontSize = (height / 10).toFixed(2);
				ctx.font = fontSize + "px Arial";
				ctx.textAlign = 'center';
				ctx.textBaseline = "middle";
				var text = sum
				// ,textX = Math.round((width - ctx.measureText(text).width) / 2),
				// textY = height / 2;
				const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
				const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);

				ctx.fillText(text, centerX, centerY);
				// ctx.save();
			},
		}
	];
	public doughnutChartType: string = 'doughnut';

	public doughnutChartLabels1: string[] = [];
	public doughnutChartData1: number[] = [];

	public doughnutChartLabels2: string[] = [];
	public doughnutChartData2: number[] = [];

	public doughnutChartLabels3: string[] = [];
	public doughnutChartData3: number[] = [];

	public doughnutChartLabels4: string[] = [];
	public doughnutChartData4: number[] = [];


	public doughnutChartLabelsHP1: string[] = [];
	public doughnutChartDataHP1: number[] = [];

	public doughnutChartLabelsHP2: string[] = [];
	public doughnutChartDataHP2: number[] = [];

	public doughnutChartLabelsHP3: string[] = [];
	public doughnutChartDataHP3: number[] = [];

	public doughnutChartLabelsHP4: string[] = [];
	public doughnutChartDataHP4: number[] = [];


	public doughnutChartLabelsPL1: string[] = [];
	public doughnutChartDataPL1: number[] = [];

	public doughnutChartLabelsPL4: string[] = [];
	public doughnutChartDataPL4: number[] = [];


	public doughnutChartLabelsIN1: string[] = [];
	public doughnutChartDataIN1: number[] = [];

	totalPlanifie = 0

	constructor(private pageTitleService: PageTitleService,
		private dashboardService: DashboardService,
		private _currentUser: CurrentUserService,
		private utilisateurService: UtilisateurService,
		private cdref: ChangeDetectorRef) {
		this.userItem = this._currentUser.getRoleCurrentUser();
		moment.updateLocale('fr', {
			week: {
				dow: 1, // Monday is the first day of the week.
			}
		});
	}

	ngAfterViewInit() {
		// Cette semaine
		this.getInfos()
		this.getDelegues()
		this.sectionSearchDate('2', 'w')
		this.cdref.detectChanges();
	}

	ngOnInit() {
		setTimeout(() => {
			this.pageTitleService.setTitle("Accueil");
		}, 0);
	}

	getInfos() {
		this._currentUser.getInfos()
			.subscribe((res: any) => {
				this.date_jour = moment(res.date_jour).format('YYYY-MM-DD');
			}, err => {
			})
	}

	getDelegues() {

		const body = {
			nom_utilisateur: null,
			role: null,
			email: null,
			telephone: null,
			code_gamme: null,
			code_region: null,
			order_by: null,
			type_tri: null
		};

		this.utilisateurService.getDelegues(999999999, 0, body)
			.subscribe((res: any) => {
				this.listeUtilisateurs = res.delegues.map(item => {
					return {
						role: item.role,
						code_codification: item.id_utilisateur,
						id_utilisateur: item.id_utilisateur,
						libelle_codification: item.nom_utilisateur,
					}
				});
			}, err => {
				// this.showMessageError();
			})

	}

	optionSelectedDelegue(event) {
		if (event?.id_utilisateur) {
			this.id_utilisateur = event.id_utilisateur
			this.role = event.role
		} else {
			this.id_utilisateur = null
			this.role = null
		}
		this.getStatistiquesDashboard()
	}

	sectionSearchDate(value?, momentd?) {
		this.is_enabledPeriod = false;
		switch (value) {
			case '1':
				this.date_debut = moment(this.date_jour).subtract(1, momentd).startOf(momentd).format('YYYY-MM-DD');
				this.date_fin = moment(this.date_jour).subtract(1, momentd).endOf(momentd).format('YYYY-MM-DD');
				this.getStatistiquesDashboard()
				break;
			case '2':
				this.date_debut = moment(this.date_jour).startOf(momentd).format('YYYY-MM-DD');
				this.date_fin = this.date_jour;
				this.getStatistiquesDashboard()
				break;
			case '3': // Période
				this.is_enabledPeriod = true;
				break;
			default: // Totalité
				this.date_debut = null;
				this.date_fin = null;
				this.getStatistiquesDashboard()
				break;
		}
	}

	getStatistiquesDashboard() {
		this.chart = false
		this.chartTab = this.chart
		const body = {
			date_debut: this.date_debut,
			date_fin: this.date_fin,
			id_utilisateur: this.id_utilisateur ? this.id_utilisateur : null,
			role_utilisateur: this.role ? this.role : null
		}
		this.dashboardService.getStatistiquesDashboard(body)
			.subscribe((res: any) => {
				this.statistiques = res.statistiques;

				this.visitesEffectueesPlanifiees()
				this.visitesEffectueesHorsPlanification()
				this.planifications()
				this.investissements()
				this.chart = true
				this.chartTab = this.chart
			}, err => {
				this.chart = true
				this.chartTab = this.chart
				// this.showMessageError();
			})
	}

	tabChange($event) {
		this.chartTab = false
		// console.log($event)
		setTimeout(() => {
			this.chartTab = true
		}, 1000);
	}

	visitesEffectueesPlanifiees() {
		var numTotal1 = (this.statistiques?.nbr_visites_medicales_planifiees + this.statistiques?.nbr_visites_pharmaceutiques_planifiees)
		const visites_medicales_planifiees = (this.statistiques?.nbr_visites_medicales_planifiees * 100) / numTotal1
		const visites_pharmaceutiques_planifiees = (this.statistiques?.nbr_visites_pharmaceutiques_planifiees * 100) / numTotal1

		this.doughnutChartLabels1 = [
			`Médicales (${visites_medicales_planifiees.toFixed(0)}%)`,
			`Pharmaceutiques (${visites_pharmaceutiques_planifiees.toFixed(0)}%)`
		]
		this.doughnutChartData1 = [
			this.statistiques?.nbr_visites_medicales_planifiees,
			this.statistiques?.nbr_visites_pharmaceutiques_planifiees
		]

		var numTotal2 = (this.statistiques?.nbr_visites_privees_planifiees + this.statistiques?.nbr_visites_publiques_planifiees)
		const visites_privees_planifiees = (this.statistiques?.nbr_visites_privees_planifiees * 100) / numTotal2
		const visites_publiques_planifiees = (this.statistiques?.nbr_visites_publiques_planifiees * 100) / numTotal2

		this.doughnutChartLabels2 = [
			`Privées (${visites_privees_planifiees.toFixed(0)}%)`,
			`Publiques (${visites_publiques_planifiees.toFixed(0)}%)`
		]
		this.doughnutChartData2 = [
			this.statistiques?.nbr_visites_privees_planifiees,
			this.statistiques?.nbr_visites_publiques_planifiees
		]

		var numTotal3 = (this.statistiques?.nbr_visites_simples_planifiees + this.statistiques?.nbr_visites_en_double_planifiees)
		const visites_simples_planifiees = (this.statistiques?.nbr_visites_simples_planifiees * 100) / numTotal3
		const visites_en_double_planifiees = (this.statistiques?.nbr_visites_en_double_planifiees * 100) / numTotal3

		this.doughnutChartLabels3 = [
			`Simples (${visites_simples_planifiees.toFixed(0)}%)`,
			`Doubles (${visites_en_double_planifiees.toFixed(0)}%)`
		]
		this.doughnutChartData3 = [
			this.statistiques?.nbr_visites_simples_planifiees,
			this.statistiques?.nbr_visites_en_double_planifiees
		]

		this.doughnutChartLabels4 = [
			...this.statistiques?.gammes.map((el) => `${el.gamme} (${((el.nbr_visites_realisees_planifiees * 100) / this.statistiques?.nbr_total_gammes_visites_planifiees).toFixed(0)}%)`)
		]
		this.doughnutChartData4 = [
			...this.statistiques?.gammes.map((el) => el.nbr_visites_realisees_planifiees)
		]
	}

	visitesEffectueesHorsPlanification() {
		var numTotal1 = (this.statistiques?.nbr_visites_medicales_non_planifiees + this.statistiques?.nbr_visites_pharmaceutiques_non_planifiees)
		const visites_medicales_non_planifiee = (this.statistiques?.nbr_visites_medicales_non_planifiees * 100) / numTotal1
		const visites_pharmaceutiques_non_planifiees = (this.statistiques?.nbr_visites_pharmaceutiques_non_planifiees * 100) / numTotal1

		this.doughnutChartLabelsHP1 = [
			`Médicales (${visites_medicales_non_planifiee.toFixed(0)}%)`,
			`Pharmaceutiques (${visites_pharmaceutiques_non_planifiees.toFixed(0)}%)`
		]
		this.doughnutChartDataHP1 = [
			this.statistiques?.nbr_visites_medicales_non_planifiees,
			this.statistiques?.nbr_visites_pharmaceutiques_non_planifiees
		]

		var numTotal2 = (this.statistiques?.nbr_visites_privees_non_planifiees + this.statistiques?.nbr_visites_publiques_non_planifiees)
		const visites_privees_non_planifiees = (this.statistiques?.nbr_visites_privees_non_planifiees * 100) / numTotal2
		const visites_publiques_non_planifiees = (this.statistiques?.nbr_visites_publiques_non_planifiees * 100) / numTotal2

		this.doughnutChartLabelsHP2 = [
			`Privées (${visites_privees_non_planifiees.toFixed(0)}%)`,
			`Publiques (${visites_publiques_non_planifiees.toFixed(0)}%)`
		]
		this.doughnutChartDataHP2 = [
			this.statistiques?.nbr_visites_privees_non_planifiees,
			this.statistiques?.nbr_visites_publiques_non_planifiees
		]

		var numTotal3 = (this.statistiques?.nbr_visites_simples_non_planifiees + this.statistiques?.nbr_visites_en_double_non_planifiees)
		const visites_simples_non_planifiees = (this.statistiques?.nbr_visites_simples_non_planifiees * 100) / numTotal3
		const visites_en_double_non_planifiees = (this.statistiques?.nbr_visites_en_double_non_planifiees * 100) / numTotal3

		this.doughnutChartLabelsHP3 = [
			`Simples (${visites_simples_non_planifiees.toFixed(0)}%)`,
			`Doubles (${visites_en_double_non_planifiees.toFixed(0)}%)`
		]
		this.doughnutChartDataHP3 = [
			this.statistiques?.nbr_visites_simples_non_planifiees,
			this.statistiques?.nbr_visites_en_double_non_planifiees
		]

		this.doughnutChartLabelsHP4 = [
			...this.statistiques?.gammes.map((el) => `${el.gamme} (${((el.nbr_visites_realisees_non_planifiees * 100) / this.statistiques?.nbr_total_gammes_visites_non_planifiees).toFixed(0)}%)`)
		]
		this.doughnutChartDataHP4 = [
			...this.statistiques?.gammes.map((el) => el.nbr_visites_realisees_non_planifiees)
		]
	}

	planifications() {
		var numTotal1 = this.statistiques?.nbr_total_planifications
		const mes_planifications = (this.statistiques?.nbr_mes_planifications * 100) / numTotal1
		const autre_planifications = (this.statistiques?.nbr_autre_planification * 100) / numTotal1
		
		this.doughnutChartLabelsPL1 = [
			`${this.id_utilisateur ? 'Planifications du délégué' : 'Mes planifications'} (${mes_planifications.toFixed(0)}%)`,
			`Autres planifications (${autre_planifications.toFixed(0)}%)`
		]
		this.doughnutChartDataPL1 = [
			this.statistiques?.nbr_mes_planifications,
			this.statistiques?.nbr_autre_planification
		]

		this.totalPlanifie = (this.statistiques?.total_absent + this.statistiques?.total_en_attente + this.statistiques?.total_realises + this.statistiques?.total_replanifies)
		const absent = (this.statistiques?.total_absent * 100) / this.totalPlanifie
		const en_attente = (this.statistiques?.total_en_attente * 100) / this.totalPlanifie
		const realises = (this.statistiques?.total_realises * 100) / this.totalPlanifie
		const replanifies = (this.statistiques?.total_replanifies * 100) / this.totalPlanifie

		this.doughnutChartLabelsPL4 = [
			`Absents (${absent.toFixed(0)}%)`,
			`En attente (${en_attente.toFixed(0)}%)`,
			`Replanifiés (${replanifies.toFixed(0)}%)`,
			`Réalisés (${realises.toFixed(0)}%)`
		]
		this.doughnutChartDataPL4 = [
			this.statistiques?.total_absent,
			this.statistiques?.total_en_attente,
			this.statistiques?.total_replanifies,
			this.statistiques?.total_realises,
		]
	}

	investissements() {
		const totalInvestissements = this.statistiques?.nbr_total_investissements
		const valides = (this.statistiques?.nbr_investissements_valides * 100) / totalInvestissements
		const en_attente = (this.statistiques?.nbr_investissements_en_attente * 100) / totalInvestissements
		const realises = (this.statistiques?.nbr_investissements_realises * 100) / totalInvestissements
		const rejetes = (this.statistiques?.nbr_investissements_rejetes * 100) / totalInvestissements

		this.doughnutChartLabelsIN1 = [
			`Validés (${valides.toFixed(0)}%)`,
			`En attente (${en_attente.toFixed(0)}%)`,
			`Réalisés (${realises.toFixed(0)}%)`,
			`Rejetés (${rejetes.toFixed(0)}%)`
		]
		this.doughnutChartDataIN1 = [
			this.statistiques?.nbr_investissements_valides,
			this.statistiques?.nbr_investissements_en_attente,
			this.statistiques?.nbr_investissements_realises,
			this.statistiques?.nbr_investissements_rejetes
		]
	}
}
