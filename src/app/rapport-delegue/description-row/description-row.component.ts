import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ms-description-row',
  templateUrl: './description-row.component.html',
  styleUrls: ['./description-row.component.scss']
})
export class DescriptionRowComponent implements OnInit {
  annee
  row
  description

  constructor() {

  }

  ngOnInit(): void {
    this.description = {
      total_nbr_total_visites: {
        libelle: 'Visites Totales réalisées',
        description: 'Visites Totales réalisées = Visites plannifiées +  Visites Hors plan'
      },
      total_nbr_jours_travaille: {
        libelle: 'Nombre de jours travaillés',
        description: `la somme de jours travaillés  pour l\'annee de ${this.annee}`
      },
      total_moyen: {
        libelle: 'Moyenne',
        description: 'Moyenne de visites par jour =  Visites Totales réalisées / Nombre de jours travaillés'
      }
    }
  }

}
