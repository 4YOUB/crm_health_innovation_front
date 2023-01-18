import { Component, OnInit } from '@angular/core';
import { PageTitleService } from 'app/core/page-title/page-title.service';

@Component({
  selector: 'ms-page-administration',
  templateUrl: './page-administration.component.html',
  styleUrls: ['./page-administration.component.scss']
})
export class PageAdministrationComponent implements OnInit {

  constructor(private pageTitleService: PageTitleService,) { }

  ngOnInit(): void {
    setTimeout(() => {
			this.pageTitleService.setTitle("Administration");
		}, 0);
  }
}
