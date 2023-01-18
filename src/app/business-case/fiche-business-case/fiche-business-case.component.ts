import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BusinessCaseService } from 'app/service/business-case-service/business-case.service';

@Component({
  selector: 'ms-fiche-business-case',
  templateUrl: './fiche-business-case.component.html',
  styleUrls: ['./fiche-business-case.component.scss']
})
export class FicheBusinessCaseComponent implements OnInit {
  id_business_case
  isLoading: boolean = false;
  business_case: any;
  imgUpload: any;
  id_document: any;
  nameFile: any;
  selectedFiles: { data: string; inProgress: boolean; progress: number; };
  extensionFile: any;
  localUrl: any;

  constructor(
    public dialogRef: MatDialogRef<FicheBusinessCaseComponent>,
    private businessCaseService: BusinessCaseService,
  ) { }

  ngOnInit(): void {
    this.getFicheBusinessCase();
  }

  getFicheBusinessCase() {
    this.isLoading = true;

    this.businessCaseService.getFicheBusinessCase(this.id_business_case)
      .subscribe((res: any) => {
        this.business_case = res.business_case;
        if(this.business_case.id_document){
          this.imgUpload    = this.business_case.url_document
          this.id_document  = this.business_case.id_document
          this.nameFile     = this.business_case.intitule_document
          this.extensionFile = this.business_case.extension_document;
          this.selectedFiles = {
            data: '',
            inProgress: true,
            progress: 100,
          }
        }
        this.isLoading = false;
      }, err => {
        // this.showMessageError();
      })
  }

}
