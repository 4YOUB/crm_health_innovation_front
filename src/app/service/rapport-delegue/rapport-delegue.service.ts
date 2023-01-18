import { Injectable } from '@angular/core';
import { ApiService } from '../api-service/api.service';
import { Apis } from '../API';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RapportDelegueService {
  constructor(private apiService: ApiService, private http: HttpClient) { }

  getRapportAnnuel(body) {
    return this.apiService.post(`${Apis.main.test_annuel}`, body)
  }

  getAnneExiste() {
    return this.apiService.post(`${Apis.main.annee_existe}`)
  }

  getSubUsers(body?) {
    return this.apiService.post(`${Apis.main.sub_users}`, body)
  }

  exportTauxCoverture(body) {
    return this.apiService.export(`${Apis.main.export_taux_coverture}`, body)
  }
}
