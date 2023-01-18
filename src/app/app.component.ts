import {Component, Optional, ViewEncapsulation} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService} from '@ngx-translate/core';

@Component({
  	selector: 'gene-app',
   template:`<router-outlet></router-outlet>
   			<ngx-loading-bar></ngx-loading-bar>`,
   encapsulation: ViewEncapsulation.None
})

export class GeneAppComponent {
   constructor(translate: TranslateService,
      private matIconRegistry: MatIconRegistry,
      private domSanitizer: DomSanitizer,) {
      translate.addLangs(['en', 'fr', 'he', 'ru' , 'ar' , 'zh' ,'de' , 'es', 'ja', 'ko' , 'it' ,'hu']);
      translate.setDefaultLang('en');
      this.registerIcons()
      const browserLang: string = translate.getBrowserLang();
      translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
   }

   registerIcons(): void {
      this.loadIcons(Object.keys(Icons), 'assets/icon');
   }
   loadIcons(iconKeys: string[], iconUrl: string): void {
      iconKeys.forEach(key => {
         this.matIconRegistry.addSvgIcon(key, this.domSanitizer.bypassSecurityTrustResourceUrl(`${iconUrl}/${key}.svg`));
      });
   }
}
export enum Icons {
   medecin = "medecin",
   pharmacie = "pharmacie",
   cloudUploadAlt = "cloudUploadAlt"
}