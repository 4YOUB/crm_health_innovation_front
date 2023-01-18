import { Injectable } from '@angular/core';
import { ApiService } from '../api-service/api.service';
import { Apis } from '../API';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlanificationService {

  constructor(private apiService: ApiService, private http: HttpClient) { }

  getListePlanification(records_per_page, page_number, body) {
    return this.apiService.post(`${Apis.main.getListePlanification}${records_per_page}/${page_number}`, body)
  }
  getPlanificationPartenaire( records_per_page, page_number, body ) {
    return this.apiService.post(`${Apis.main.liste_planification_partenaires}${records_per_page}/${page_number}`, body)
  }
  getPartenairePlanifies( body ) {
    return this.apiService.post(`${Apis.main.liste_partenaires_planifies}`, body)
  }
  updPartenairePlanifies( id_planification ) {
    return this.apiService.get(`${Apis.main.modifier_partenaires_planifies}${id_planification}`)
  }
  ajouterPlanification( body ) {
    return this.apiService.post(`${Apis.main.ajouter_planification}`, body)
  }
  ajouterPartenairePlanifiee( body ) {
    return this.apiService.post(`${Apis.main.ajouter_partenaire_planifiee}`, body)
  }
  annulerPartenairePlanifiee( body ) {
    return this.apiService.post(`${Apis.main.annuler_partenaire_planifiee}`, body)
  }
  getRapports(records_per_page, page_number, body) {
    return this.apiService.post(`${Apis.main.liste_rapports}${records_per_page}/${page_number}`, body)
  }
  ajouterRapports(body) {
    return this.apiService.post(`${Apis.main.ajouterRapports}`, body)
  }
  getFichePlanification(id_planification) {
    return this.apiService.get(`${Apis.main.fiche_planification}${id_planification}`)
  }
  exportPlanifications(body){
    return this.apiService.export(`${Apis.main.export_planifications}`, body)
  }
  exportRapports(body){
    return this.apiService.export(`${Apis.main.export_visites}`, body)
  }
}
