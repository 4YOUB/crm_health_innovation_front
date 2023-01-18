import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(private cookieService: CookieService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let user_item = this.cookieService.get("userItem");

    req = req.clone({
      setHeaders: {
        // 'Content-Type' : 'application/json; charset=utf-8',
        // 'Accept'       : 'application/json',
        'Authorization': `Bearer ${user_item}`,
        // 'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        // 'Pragma': 'no-cache',
        // 'Expires': '0'
        //"Pragma": "no-cache",
        //"Expires": -1,
        // "Cache-Control": "no-cache"
      },
    });

    return next.handle(req);

  }
}
