import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { VisiteService } from 'app/service/visite-service/visite.service';

@Component({
  selector: 'ms-partenaires-modal',
  templateUrl: './partenaires-modal.component.html',
  styleUrls: ['./partenaires-modal.component.scss']
})
export class PartenairesModalComponent implements OnInit {

  constructor(private visiteService: VisiteService,
    public dialogRef: MatDialogRef<PartenairesModalComponent>) { }
  id_visite
  partenaires = []
  ngOnInit(): void {
    this.visiteService.visitePartenaires(this.id_visite).subscribe(res => {
      this.partenaires = res
    })
  }

}
