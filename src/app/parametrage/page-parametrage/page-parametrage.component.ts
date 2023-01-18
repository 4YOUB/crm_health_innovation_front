import { Component, OnInit } from '@angular/core';
import { PageTitleService } from 'app/core/page-title/page-title.service';

@Component({
  selector: 'ms-page-parametrage',
  templateUrl: './page-parametrage.component.html',
  styleUrls: ['./page-parametrage.component.scss']
})
export class PageParametrageComponent implements OnInit {

  constructor(private pageTitleService: PageTitleService,) { }

  ngOnInit(): void {
    setTimeout(() => {
			this.pageTitleService.setTitle("Paramétrage");
		}, 0);
  }

}
