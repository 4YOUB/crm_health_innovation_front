import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apis } from '../API';
import { ApiService } from '../api-service/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  constructor(private apiService: ApiService, private http: HttpClient) { }

  getProduits(records_per_page, page_number, body) {
    return this.apiService.post(`${Apis.main.liste_produits}/${records_per_page}/${page_number}`, body)
  }
  getFicheProduit(idProduit) {
    return this.apiService.get(`${Apis.main.fiche_produit}/${idProduit}`)
  }
  ajouterProduit(body) {
    return this.apiService.post(`${Apis.main.ajouter_produit}`, body)
  }
  modifierProduit(body) {
    return this.apiService.post(`${Apis.main.modifier_produit}`, body)
  }
  activerProduit(idProduit) {
    return this.apiService.post(`${Apis.main.activer_produit}/${idProduit}`)
  }
  desactiverProduit(idProduit) {
    return this.apiService.post(`${Apis.main.desactiver_produit}/${idProduit}`)
  }
}
