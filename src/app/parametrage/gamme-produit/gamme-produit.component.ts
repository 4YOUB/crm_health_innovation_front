import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ms-gamme-produit',
  templateUrl: './gamme-produit.component.html',
  styleUrls: ['./gamme-produit.component.scss']
})
export class GammeProduitComponent implements OnInit {

  listeGamme
  libelle_produit
  constructor(public dialogRef: MatDialogRef<GammeProduitComponent>,) { }

  ngOnInit(): void {
  }

}
