import { Injectable } from "@angular/core";
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate } from "@angular/router";
import { Observable } from "rxjs/Rx";
import { CurrentUserService } from "./current-user.service";
import { AuthService } from "./auth-service/auth.service";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(private authService: AuthService,
        private _currentUser: CurrentUserService,
        private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {

            if (!this.authService.isLogged()) {
                resolve(false);
                return;
            }

            var currentUser
            this._currentUser.getCurrentUser().then((resp) => {
                currentUser = resp;
                let roles = route && route.data["roles"] && route.data["roles"].length > 0 ? route.data["roles"].map(xx => xx.toUpperCase()) : null;
                let role  = currentUser.role 
                if (roles == null || roles.indexOf(role) != -1 ) resolve(true);
                else {
                    resolve(false);
                    this.router.navigate(['/']);
                }
            }).catch((err) => {
                reject(err);
                this.router.navigate(['/login']);
            });
        });

    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            if (!this.authService.isLogged()) {
                resolve(false);
                return;
            }

            var currentUser

            this._currentUser.getCurrentUser().then((resp) => {
                currentUser = resp;
                let roles = route && route.data["roles"] && route.data["roles"].length > 0 ? route.data["roles"].map(xx => xx.toUpperCase()) : null;
                let role  = currentUser.role 
                if (roles == null || roles.indexOf(role) != -1 ) resolve(true);
                else {
                    resolve(false);
                    this.router.navigate(['/']);
                }
            }).catch((err) => {
                reject(err);
                this.router.navigate(['/login']);
            });
        });
    }
}