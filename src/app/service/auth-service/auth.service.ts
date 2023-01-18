import { Inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { DOCUMENT } from '@angular/common';
import { Apis } from "../API";
import { ApiService } from "../api-service/api.service";
import jwt_decode from "jwt-decode";
import { ParamsAppService } from "../params-app-service/params-app.service";

@Injectable({
   providedIn: 'root'
})
export class AuthService {

   user: Observable<firebase.User>;
   userData: any;
   isLoggedIn = false;

   constructor(private firebaseAuth: AngularFireAuth,
      private router: Router,
      private cookieService: CookieService,
      private toastr: ToastrService,
      private apiService: ApiService,
      private paramsAppService: ParamsAppService,

      @Inject(DOCUMENT) private document: Document) {
      this.user = firebaseAuth.authState;
   }

   /*
    *  getLocalStorageUser function is used to get local user profile data.
    */
   isLogged() {
      try {
         const token = this.cookieService.get("userItem")
         jwt_decode(token)
         return true;
      } catch (error) {
         return false;
      }
   }
   getLocalStorageUser() {
      // this.userData = JSON.parse(localStorage.getItem("userProfile"));
      if (this.cookieService.check("userData") && this.cookieService.check("userItem")) {
         this.isLoggedIn = true;
         return true;
      } else {
         this.isLoggedIn = false;
         return false;
      }
   }

   /*
    * loginUser fuction used to login
    */
   loginUser(data) {
      return this.apiService.post(Apis.main.authentification, data);
   }

   /*
 * logOut function is used to sign out
 */
   logOut() {
      // this.router.navigate(['/login']);
      this.cookieService.delete("userItem")
      this.cookieService.delete("userData")
      let hostname = this.document.location.hostname;
      this.cookieService.delete("userItem", '/', hostname.split('.').slice(-2).join('.'))
      this.cookieService.delete("userData", '/', hostname.split('.').slice(-2).join('.'))
      this.paramsAppService.remove();
      this.isLoggedIn = false;
      this.toastr.success("Déconnecté avec succès!");
      // if(this.router.url.split("/")[1] == 'compte')
      this.router.navigate(['/']);
   }

   deconnexion() {
      return this.apiService.post(`${Apis.main.deconnexion}`, {});
   }

   /*
* check expire session
*/
   checkExpireSession() {
      return this.apiService.post(`${Apis.main.validation}`, {});
   }
   /*

* signupUserProfile method save email and password into firabse &
* signupUserProfile method save the user sign in data into local storage.
*/
   signupUserProfile(value) {
      this.firebaseAuth
         .createUserWithEmailAndPassword(value.email, value.password)
         .then(value => {
            this.toastr.success('Successfully Signed Up!');
            this.setLocalUserProfile(value);
            this.router.navigate(['/']);
         })
         .catch(err => {
            this.toastr.error(err.message);
         });
   }

   /*
    * resetPassword is used to reset your password
    */
   resetPassword(value) {
      this.firebaseAuth.sendPasswordResetEmail(value.email)
         .then(value => {
            this.toastr.success("A password reset link has been sent to this email.");
            this.router.navigate(['/login']);
         })
         .catch(err => {
            this.toastr.error(err.message);
         });
   }


   /*
    * resetPasswordV2 is used to reset your password
    */
   resetPasswordV2(value) {
      this.firebaseAuth.sendPasswordResetEmail(value.email)
         .then(value => {
            this.toastr.success("A password reset link has been sent to this email.");
            this.router.navigate(['/login']);
         })
         .catch(err => {
            this.toastr.error(err.message);
         });
   }

   /*
    * setLocalUserProfile function is used to set local user profile data.
    */
   setLocalUserProfile(value) {
      localStorage.setItem("userProfile", JSON.stringify(value));
      this.getLocalStorageUser();
      this.isLoggedIn = true;
   }

}
