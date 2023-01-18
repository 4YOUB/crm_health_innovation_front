import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CoreService } from '../../service/core/core.service';
import { MenuItems } from '../../core/menu/menu-items/menu-items';
import { CurrentUserService } from 'app/service/current-user.service';

@Component({
   selector: 'ms-side-bar',
   templateUrl: './side-bar.component.html',
   styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
   @Input() menuList: any;
   @Input() verticalMenuStatus: boolean;
   userItem;
   version;
   constructor(
      public translate: TranslateService,
      private router: Router,
      public coreService: CoreService,
      private _currentUser: CurrentUserService,
      public menuItems: MenuItems
   ) {
      this.userItem = this._currentUser.getRoleCurrentUser();
      this._currentUser.getInfos()
         .subscribe((res: any) => {
            this.version = res.version;
         }, err => {
         })
   }
   _menuItems = this.menuItems.getAll()

   ngOnInit() { }

   //render to the crm page
   onClick() {
      var first = location.pathname.split('/')[1];
      if (first == 'horizontal') {
         this.router.navigate(['/horizontal/dashboard/crm']);
      } else {
         this.router.navigate(['/dashboard/crm']);
      }
   }

}
