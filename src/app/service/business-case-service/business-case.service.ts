import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apis } from '../API';
import { ApiService } from '../api-service/api.service';
import { UploadService } from '../upload-service/upload.service';
@Injectable({
  providedIn: 'root'
})
export class BusinessCaseService {

  constructor(private apiService: ApiService,private apiUploadService: UploadService, private http: HttpClient) { }

  getBC(records_per_page, page_number, body) {
    return this.apiService.post(`${Apis.main.liste_businessCases}${records_per_page}/${page_number}`, body)
  }
  ajouterBusinessCase(body) {
    return this.apiService.post(`${Apis.main.ajouterBusinessCase}`, body)
  }
  uploadImage(code,id_partenaire ,imgExtension ,fd) {
    return this.apiUploadService.upload(`${Apis.main.uploadImageswithout}${code}/${id_partenaire}/${imgExtension}`, fd)
  }
  getFicheBusinessCase(id_business_case) {
    return this.apiService.get(`${Apis.main.fiche_businessCases}/${id_business_case}`)
  }
  modifierBusinessCase(body) {
    return this.apiService.post(`${Apis.main.modifierBusinessCase}`, body)
  }
  validerInvestissement(id_business_case) {
    return this.apiService.post(`${Apis.main.validerBusinessCase}/${id_business_case}`)
  }
  rejeterInvestissement(id_business_case) {
    return this.apiService.post(`${Apis.main.rejeterBusinessCase}/${id_business_case}`)
  }
  realiserInvestissement(id_business_case) {
    return this.apiService.post(`${Apis.main.realiserBusinessCase}/${id_business_case}`)
  }
  exportBc(body) {
    return this.apiService.export(`${Apis.main.export_bc}`, body)
  }
}
