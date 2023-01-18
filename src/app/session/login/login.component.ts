import { Component, OnInit ,ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../service/auth-service/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { CookieStoreService } from '../../service/cookieService/cookieService.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import Swal from "sweetalert2";
import { ParamsAppService } from "../../service/params-app-service/params-app.service";

@Component({
   selector: 'ms-login-session',
   templateUrl:'./login-component.html',
   styleUrls: ['./login-component.scss'],
   encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
	
  email    : string ="demo@example.com";
  password : string = "0123456789";
  loginForm: FormGroup;
  isSubmitted: boolean = false;
  loading = false
  hide = true;

  constructor( public authService: AuthService,
               public translate : TranslateService,
               private cookieService: CookieStoreService, 
               private router : Router,
               private toastr : ToastrService,
               private route: ActivatedRoute,
               private paramsAppService: ParamsAppService,) { 
                  if (this.authService.getLocalStorageUser()) {
                     // navigate to mes annonces
                     this.router.navigate(['/']);
                  }
                  this.initFormlogin()
               }

               initFormlogin() {
                  this.loginForm = new FormGroup({
                     email: new FormControl(''),
                     password: new FormControl('',)/* [Validators.minLength(8)] */
                  }
                  );
               }

   // when email and password is correct, user logged in.
   login(value) {
      this.loginForm = new FormGroup({
         email: new FormControl(value.email),
         password: new FormControl(value.password)/* [Validators.minLength(8)] */
      }
      );
      this.isSubmitted = true
      setTimeout(() => {
         if (this.isSubmitted == true && this.loginForm.valid) {
            this.loading = true
            let data = { login: this.loginForm.get('email').value, password: this.loginForm.get('password').value };;
            this.authService.loginUser(data).subscribe((res) => {
               if (res) {
                  if (res['validation']) {
                     this.cookieService.setTOKEN(res['token']);
                     this.cookieService.setData('userData', res['user']);
                     this.paramsAppService.get();
                     this.toastr.success('Bienvenue dans votre application');
                     this.router.navigate(['/']);
                     // var returnUrl = this.route.snapshot.queryParams['returnUrl'];
                     // if (returnUrl)
                     //  this.router.navigate(['/profil']);
                  }
                  else {
                     this.showAlertAuthError();
                  }
                  this.loading = false
               }
            }, (error) => {
               //To delete 401 Error from the console
               console.clear();
               this.loading = false
               this.showAlertAuthError();
            }
            );
         }
      }, 100)
   }
	

   showAlertAuthError() {
      Swal.fire({
         icon: 'error',
         title: 'Erreur d\'authentification',
         text: 'Identifiant ou mot de passe est incorrect',
         timer: 2500,
         heightAuto: false,
      })
   }
}