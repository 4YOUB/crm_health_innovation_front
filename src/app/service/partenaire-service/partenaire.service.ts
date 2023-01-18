import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../api-service/api.service';
import { Apis } from '../API';

@Injectable({
  providedIn: 'root'
})
export class PartenaireService {

  constructor(private apiService: ApiService, private http: HttpClient) { }

  getPartenaire(records_per_page, page_number, body) {
    return this.apiService.post(`${Apis.main.liste_partenaires}${records_per_page}/${page_number}`, body)
  }
  ajouterPartenaire(body) {
    return this.apiService.post(`${Apis.main.ajouterPartenaire}`, body)
  }
  modifierPartenaire(body) {
    return this.apiService.post(`${Apis.main.modifierPartenaire}`, body)
  }
  getFichePartenaire(idPartenaire){
    return this.apiService.get(`${Apis.main.getFichePartenaire}${idPartenaire}`)
  }
  desactiverPartenaire(idPartenaire){
    return this.apiService.post(`${Apis.main.desactiverPartenaire}${idPartenaire}`)
  }
  activerPartenaire(idPartenaire){
    return this.apiService.post(`${Apis.main.activerPartenaire}${idPartenaire}`)
  }
  getTabVisite(records_per_page, page_number, body) {
    return this.apiService.post(`${Apis.main.getTabVisite}${records_per_page}/${page_number}`, body)
  }
  getTabNote(records_per_page, page_number, body) {
    return this.apiService.post(`${Apis.main.getTabNote}${records_per_page}/${page_number}`, body);
  }
  getTabBusinessCases(records_per_page, page_number, body) {
    return this.apiService.post(`${Apis.main.getTabBusinessCases}${records_per_page}/${page_number}`, body)
  }
  getTabDocuments(records_per_page, page_number, body) {
    return this.apiService.post(`${Apis.main.getTabDocuments}${records_per_page}/${page_number}`, body)
  }
  ajouterNote(body) {
    return this.apiService.post(`${Apis.main.ajouterNote}`, body)
  }
  ajouterDocument(body) {
    return this.apiService.post(`${Apis.main.ajouterDocument}`, body)
  }
  supprimerNote(id_note){
    return this.apiService.post(`${Apis.main.supprimerNote}${id_note}`)
  }
  supprimerDocuments(id_document){
    return this.apiService.post(`${Apis.main.supprimerDocuments}${id_document}`)
  }
  exportPartenaires(body){
    return this.apiService.export(`${Apis.main.export_partenaires}`, body)
  }
}
