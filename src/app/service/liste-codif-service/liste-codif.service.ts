import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../api-service/api.service';
import { Apis } from '../API';

@Injectable({
  providedIn: 'root'
})
export class ListeCodifService {

  constructor(private apiService: ApiService, private http: HttpClient) { }
  
  getListePartenaire(type){
    return this.apiService.get(`${Apis.main.getListePartenaire}${type}`)
  }
  getUtilisateurs(mode?){
    return this.apiService.get(`${Apis.main.liste_utilisateurs}${mode?mode:''}`)
  }
  getUtilisateursAccompagnants(){
    return this.apiService.get(`${Apis.main.getUtilisateursAccompagnants}`)
  }
  getEtablissement(){
    return this.apiService.get(`${Apis.main.getEtablissement}`)
  }
  getSpecialites(){
    return this.apiService.get(`${Apis.main.getSpecialites}`)
  }
  getRevis(){
    return this.apiService.get(`${Apis.main.getRevis}`)
  }
  getGammesProduits(body){
    return this.apiService.post(`${Apis.main.getGammesProduits}`, body)
  }
  getGammes(){
    return this.apiService.get(`${Apis.main.getGammes}`)
  }
  getFeedbacks(){
    return this.apiService.get(`${Apis.main.getFeedbacks}`)
  }
  getCodification(body) {
    return this.apiService.post(`${Apis.main.getCodification}`, body)
  }
  getListeSemaines(){
    return this.apiService.get(`${Apis.main.getListeSemaines}`)
  }
  getSemaines(){
    return this.apiService.get(`${Apis.main.liste_semaines}`)
  }
  getCodifParametrages(records_per_page, page_number,body){
    return this.apiService.post(`${Apis.main.getCodifParametrages}${records_per_page}/${page_number}`, body)
  }
  activerCodif(body){
    return this.apiService.post(`${Apis.main.activerCodifParametrage}`, body)
  }
  desactiverCodif(body){
    return this.apiService.post(`${Apis.main.desactiverCodifParametrage}`, body)
  }
  ajouterCodification(body) {
    return this.apiService.post(`${Apis.main.ajouterCodifParametrage}`, body)
  }
  modifierCodification(body) {
    return this.apiService.post(`${Apis.main.modifierCodifParametrage}`, body)
  }
  get_nbr_jours(){
    return this.apiService.get(`${Apis.main.get_nbr_jours}`)
  }
  get_hours_range(){
    return this.apiService.get(`${Apis.main.get_hours_range}`)
  }
  getTypesEvenement(){
    return this.apiService.get(`${Apis.main.types_evenement}`)
  }
  get_status_colors(){
    return this.apiService.get(`${Apis.main.get_status_colors}`)
  }
  get_parametrages_app(){
    return this.apiService.get(`${Apis.main.get_parametrages_app}`)
  }
}
