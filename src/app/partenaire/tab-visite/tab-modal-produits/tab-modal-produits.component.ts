import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ms-tab-modal-produits',
  templateUrl: './tab-modal-produits.component.html',
  styleUrls: ['./tab-modal-produits.component.scss']
})
export class TabModalProduitsComponent implements OnInit {
  listeProduits
  constructor(public dialogRef: MatDialogRef<TabModalProduitsComponent>,) { }

  ngOnInit(): void {
  }

}
