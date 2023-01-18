import { Component, OnInit } from '@angular/core';
import { PageTitleService } from 'app/core/page-title/page-title.service';

@Component({
  selector: 'ms-aidez-pdf',
  templateUrl: './aidez-pdf.component.html',
  styleUrls: ['./aidez-pdf.component.scss']
})
export class AidezPdfComponent implements OnInit {
  isLoading = true
  
  constructor(private pageTitleService: PageTitleService,) { 
    setTimeout(() => {
      this.pageTitleService.setTitle("Guide Application");
    }, 0);
  }

  ngOnInit(): void {
  }

  afterLoadComplete(event){
    this.isLoading = false
  }
}
