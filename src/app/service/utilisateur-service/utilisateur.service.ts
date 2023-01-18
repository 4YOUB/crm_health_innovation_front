import { Injectable } from '@angular/core';
import { ApiService } from '../api-service/api.service';
import { Apis } from '../API';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor(private apiService: ApiService, private http: HttpClient) { }

  getUtilisateur(records_per_page, page_number, body) {
    return this.apiService.post(`${Apis.main.liste_uilisateur}${records_per_page}/${page_number}`, body)
  }
  getDelegues(records_per_page, page_number, body) {
    return this.apiService.post(`${Apis.main.liste_delegues}${records_per_page}/${page_number}`, body)
  }
  getHistoriqueUser(id_utilisateur,records_per_page, page_number) {
    return this.apiService.get(`${Apis.main.liste_historique_users}${id_utilisateur}/${records_per_page}/${page_number}`)
  }
  desactiverUtilisateur(id_utilisateur) {
    return this.apiService.post(`${Apis.main.desactiverUtilisateur}${id_utilisateur}`)
  }
  activerUtilisateur(id_utilisateur) {
    return this.apiService.post(`${Apis.main.activerUtilisateur}${id_utilisateur}`)
  }
  ajouterUtilisateur(body) {
    return this.apiService.post(`${Apis.main.ajouterUtilisateur}`, body)
  }
  modifierUtilisateur(body) {
    return this.apiService.post(`${Apis.main.modifierUtilisateur}`, body)
  }
  getResponsable(body) {
    return this.apiService.post(`${Apis.main.getResponsable}`, body)
  }
  exportDelegues(body) {
    return this.apiService.export(`${Apis.main.export_delegues}`, body)
  }
}
