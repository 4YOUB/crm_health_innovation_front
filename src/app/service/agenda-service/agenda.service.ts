import { Injectable } from '@angular/core';
import { ApiService } from '../api-service/api.service';
import { Apis } from '../API';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor(private apiService: ApiService, private http: HttpClient) { }

  getAgenda(body) {
    return this.apiService.post(`${Apis.main.agenda}`, body)
  }
  getFicheVisiteAgenda(id_visite){
    return this.apiService.get(`${Apis.main.fiche_visite_agenda}/${id_visite}`)
  }
  getAgendaEquipe(body) {
    return this.apiService.post(`${Apis.main.agenda_equipe}`, body)
  }
  getEvenements(body) {
    return this.apiService.post(`${Apis.main.evenements}`, body)
  }
  ajouterEvenement(body) {
    return this.apiService.post(`${Apis.main.ajouter_evenement}`, body)
  }
  getFicheEvenementAgenda(id_evenement){
    return this.apiService.get(`${Apis.main.fiche_evenement_agenda}/${id_evenement}`)
  }
  deleteEvenementAgenda(id_evenement){
    return this.apiService.delete(`${Apis.main.delete_evenement_agenda}/${id_evenement}`)
  }
  editEvenementAgenda(id_evenement, body){
    return this.apiService.post(`${Apis.main.edit_evenement_agenda}/${id_evenement}`, body)
  }
  suppVisitesAgenda(body){
    return this.apiService.post(`${Apis.main.supp_visites_agenda}`, body)
  }
  getEvenementsEquipe(body) {
    return this.apiService.post(`${Apis.main.evenements_equipe}`, body)
  }
  getIsDateFree(body) {
    return this.apiService.post(`${Apis.main.is_date_free}`, body)
  }
}
