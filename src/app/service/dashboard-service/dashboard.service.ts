import { Injectable } from '@angular/core';
import { ApiService } from '../api-service/api.service';
import { HttpClient } from '@angular/common/http';
import { Apis } from '../API';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiService: ApiService, private http: HttpClient) { }
  
  getStatistiquesDashboard(body){
    return this.apiService.post(`${Apis.main.getStatistiquesDashboard}`, body)
  }}
