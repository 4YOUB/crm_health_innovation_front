
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth-service/auth.service';
import { Router } from '@angular/router';
import Swal from "sweetalert2";

@Injectable()
export class ExpireSessionService implements HttpInterceptor {
    constructor(private authenticationService: AuthService,
        private router: Router,) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            const url = this.router.url.split("/")[1].split("?")[0]
            if (err.status === 401 && (url != 'login') && (url != 'page-not-found')) {
                // auto logout if 401 response returned from api
                this.authenticationService.logOut()
                Swal.fire({
                    icon: 'warning',
                    title: `Votre session est expirée`,
                    text: "veuillez vous reconnecter pour continuer",
                    heightAuto: false
                });
            }
            // const error = err.error.message || err.statusText;
            return throwError(err);
        }))
    }
}