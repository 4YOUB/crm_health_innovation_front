import { Injectable } from '@angular/core';

export interface ChildrenItems {
	state: string;
	name: string;
	type?: string;
}

export interface Menu {
	state: string;
	name: string;
	type: string;
	icon?: string;
	flag_droits: string;
	children?: ChildrenItems[];
}
import { CurrentUserService } from 'app/service/current-user.service';

@Injectable()
export class MenuItems {
	userRole: any = {};
	flag_droits_Partenaire;
	flag_droits_Planification;
	flag_droits_Visite;
	flag_droits_Investissement;
	flag_droits_Utilisateurs;
	flag_droits_Admin;
	flag_droits_Delegue;
	falg_droits_agenda;
	falg_droits_agenda_equipe;
	falg_droits_agenda_delegue;
	flag_droits_rapport_Delegue;
	constructor(private _currentUser: CurrentUserService) {
		this.userRole = this._currentUser.getRoleCurrentUser()
	}

	getAll(): Menu[] {
		this.userRole = this._currentUser.getRoleCurrentUser()

		this.userRole?.role != 'ACH'
			? this.flag_droits_Partenaire = 'O'
			: this.flag_droits_Partenaire = 'N';
		this.userRole?.role != 'ACH' && this.userRole?.role != 'ADMI'
			? this.flag_droits_Planification = 'O'
			: this.flag_droits_Planification = 'N';

		this.flag_droits_Visite = this.userRole?.role == 'ACH' ? 'N' : this.userRole?.flag_reporting;

		this.userRole?.role != 'DEL'
			? this.flag_droits_Investissement = 'O'
			: this.flag_droits_Investissement = 'N';
		this.userRole?.role == 'ADMI'
			? this.flag_droits_Utilisateurs = 'O'
			: this.flag_droits_Utilisateurs = 'N';
		this.userRole?.role == 'ADMI'
			? this.flag_droits_Admin = 'O'
			: this.flag_droits_Admin = 'N';
		this.userRole?.role != 'ACH'
			? this.falg_droits_agenda = 'O'
			: this.falg_droits_agenda = 'N';
		this.userRole?.role == 'DEL'
			? this.falg_droits_agenda_delegue = 'N'
			: this.falg_droits_agenda_delegue = 'O';
		this.userRole?.role == 'DEL'
			? this.falg_droits_agenda_equipe = 'N'
			: this.falg_droits_agenda_equipe = 'O';
		this.userRole?.role != 'DEL' && this.userRole?.role != 'ACH'
			? this.flag_droits_rapport_Delegue = 'O'
			: this.flag_droits_rapport_Delegue = 'N'
		const roleUtil = ['DIR', 'DRG', 'PM', 'DSM', 'KAM']
		roleUtil.includes(this.userRole?.role)
			? this.flag_droits_Delegue = 'O'
			: this.flag_droits_Delegue = 'N';


		let agendaChildren = []
		if (this.userRole?.role != 'DEL') {
			agendaChildren = [
				{
					state: 'mon-agenda',
					name: 'Mon Agenda',
					type: 'link',
					flag_droits: this.falg_droits_agenda,
				},
				{
					state: 'agenda-delegue',
					name: 'Un délégué de mon équipe',
					type: 'link',
					flag_droits: this.falg_droits_agenda_delegue,
				},
			]
		}
		else {
			agendaChildren = [
				{
					state: 'mon-agenda',
					name: 'Mon Agenda',
					type: 'link',
					flag_droits: this.falg_droits_agenda,
				},
			]
		}
		let reportingChildren = []

		if (this.userRole?.reporting_visite_planification == 'O')
			reportingChildren.push({
				state: 'visites',
				name: 'Visites',
				type: 'link',
				flag_droits: this.flag_droits_Visite
			})

		if (this.userRole?.reporting_taux_freq_couverture == 'O')
			reportingChildren.push({
				state: 'rapport-delegue',
				name: 'Taux de couverture',
				type: 'link',
				flag_droits: this.flag_droits_rapport_Delegue,
			})


		const MENUITEMS = [
			// {
			// 	state: 'dashboard',
			// 	name: 'DASHBOARD',
			// 	type: 'sub',
			// 	label: 'New',
			// 	// icon: 'explore',
			// 	children: [
			// 		{ state: 'crm', name: 'CRM' },
			// 		{ state: 'saas', name: 'SAAS' }
			// 	]
			// },
			{
				state: 'dashboard',
				name: 'Accueil',
				type: 'link',
				flag_droits: 'O',
			},
			{
				state: 'agenda',
				name: 'Agenda',
				type: 'sub',
				flag_droits: this.falg_droits_agenda,
				children: agendaChildren
			},
			{
				state: 'agenda',
				name: "Rapport d'agenda",
				type: 'sub',
				flag_droits: this.falg_droits_agenda_delegue,
				children: [
					{
						state: 'agenda-rapport-equipe',
						name: 'Mon équipe',
						type: 'link',
						flag_droits: this.falg_droits_agenda_delegue,
					},
					{
						state: 'agenda-rapport-delegue',
						name: 'Un délégué de mon équipe',
						type: 'link',
						flag_droits: this.falg_droits_agenda_delegue,
					},
				]
			},
			{
				state: 'planifications',
				name: 'Assistant de planification',
				type: 'link',
				flag_droits: this.flag_droits_Planification,
			},
			{
				state: 'partenaires',
				name: 'Comptes',
				type: 'link',
				flag_droits: this.flag_droits_Partenaire,
				// icon: 'safety_divider'
				// icon: 'people_alt'
			},
			// {
			// 	state: 'visites',
			// 	name: 'Visites',
			// 	type: 'link',
			// 	flag_droits: this.flag_droits_Visite,
			// },
			{
				state: '/',
				name: 'Reporting',
				type: 'sub',
				flag_droits: this.flag_droits_Visite,
				// label: 'New',
				// icon: 'explore',
				children: reportingChildren
			},
			{
				state: 'investissements',
				name: 'Investissements',
				type: 'link',
				flag_droits: this.flag_droits_Investissement,
			},
			{
				state: 'utilisateurs',
				name: 'Utilisateurs',
				type: 'link',
				flag_droits: this.flag_droits_Utilisateurs,
			},
			{
				state: 'utilisateurs/delegues',
				name: 'Délégués',
				type: 'link',
				flag_droits: this.flag_droits_Delegue,
			},
			// {
			// 	state: 'parametrage',
			// 	name: 'Paramétrage',
			// 	type: 'link',
			// 	flag_droits: this.flag_droits_Admin,
			// },
			// {
			// 	state: 'administration',
			// 	name: 'Administration',
			// 	type: 'link',
			// 	flag_droits: this.flag_droits_Admin,
			// },
			{
				state: 'administration',
				name: 'Administration',
				type: 'sub',
				flag_droits: this.flag_droits_Admin,
				children: [
					{
						state: 'gammes-specialites',
						name: 'Gammes/Spécialités',
						type: 'link',
					},
					{
						state: 'regions-villes-secteurs',
						name: 'Régions/Villes/Secteurs',
						type: 'link',
					},
					{
						state: 'etablissement',
						name: 'Types établissement',
						type: 'link',
					},
					{
						state: 'feedback',
						name: 'Feedback',
						type: 'link',
					},
					{
						state: 'produits',
						name: 'Produits',
						type: 'link',
					},
				]
			},
		];

		return MENUITEMS;
	}
	//   add(menu:any) {
	// 	 MENUITEMS.push(menu);
	//   }
}
