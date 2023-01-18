import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookieStoreService {

  constructor(@Inject(PLATFORM_ID) private platformId: any,
    private cookieService: CookieService,) { }

  setTOKEN(code: string) {
    let hostname = window.document.location.hostname;
    this.cookieService.set("userItem", code ? code : null, 30, '/', hostname.split('.').slice(-2).join('.'));
  }

  setData(name: string, data: any) {
    let hostname = window.document.location.hostname;
    this.cookieService.set(name, data ? JSON.stringify(data) : null, 30, '/', hostname.split('.').slice(-2).join('.'));
  }

  getTOKEN(name: string) {
    return this.cookieService.get(name);
  }

  /*-----------------------------------------------*/

  setStore(name: string, data: any) {
    if (isPlatformBrowser(this.platformId))
      localStorage.setItem(name, JSON.stringify(data));
  }

  getStore(name: string) {
    if (isPlatformBrowser(this.platformId))
    try {
      return localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : null;
    }
    catch(err){
      return null
    }
  }

  removeStore(name: string) {
    if (isPlatformBrowser(this.platformId))
      localStorage.removeItem(name);
  }
}
