import { Injectable } from '@angular/core';
import { ApiService } from '../api-service/api.service';
import { Apis } from '../API';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VisiteService {

  constructor(private apiService: ApiService, private http: HttpClient) { }

  getVisite(records_per_page, page_number, body) {
    return this.apiService.post(`${Apis.main.liste_visites}${records_per_page}/${page_number}`, body)
  }
  ajouterVisite(body) {
    return this.apiService.post(`${Apis.main.ajouterVisite}`, body)
  }
  getFicheVisite(id_visite) {
    return this.apiService.get(`${Apis.main.getFicheVisite}${id_visite}`)
  }
  modifierVisite(body) {
    return this.apiService.post(`${Apis.main.modifierVisite}`, body)
  }
  exportVisites(body) {
    return this.apiService.export(`${Apis.main.export_visites}`, body)
  }
  visitePartenaires(id_visite) {
    return this.apiService.get(`${Apis.main.visite_partenaires}/${id_visite}`)
  }
}
