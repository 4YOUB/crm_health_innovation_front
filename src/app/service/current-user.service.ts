import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";
import { CookieService } from 'ngx-cookie-service';
import { Apis } from './API';
import { ApiService } from './api-service/api.service';


@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  constructor(
    private cookieService: CookieService,
    private apiService: ApiService, 
    private http: HttpClient
  ) { }

  getCurrentUser() {
    return new Promise((resolve, reject) => {
      var userItem = jwt_decode(this.cookieService.get("userItem"))
      resolve(userItem)
    });
  }

  getRoleCurrentUser() {
    if(this.cookieService.check("userItem"))
    var userItem = jwt_decode(this.cookieService.get("userItem"))
    return userItem ? userItem : null
  }

  getInfos() {
    return this.apiService.get(`${Apis.main.get_infos}`)
  }
}
