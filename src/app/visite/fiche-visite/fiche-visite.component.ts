import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ListeCodifService } from 'app/service/liste-codif-service/liste-codif.service';
import { VisiteService } from 'app/service/visite-service/visite.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'ms-fiche-visite',
  templateUrl: './fiche-visite.component.html',
  styleUrls: ['./fiche-visite.component.scss']
})
export class FicheVisiteComponent implements OnInit {

  userItem: any = {};
  id_visite
  itemVisite: any = {};
  listeProduits = []
  isLoading = false

  constructor(
    public dialogRef: MatDialogRef<FicheVisiteComponent>,
    private visiteService: VisiteService,

  ) { }

  ngOnInit(): void {
    this.getFicheVisite();
  }



  getFicheVisite() {
    this.isLoading = true;

    this.visiteService.getFicheVisite(this.id_visite)
      .subscribe((res: any) => {
        this.itemVisite = res.visite;
        this.listeProduits = res.visite?.produits;
        this.isLoading = false;
      }, err => {
        // this.showMessageError();
      })
  }
}

