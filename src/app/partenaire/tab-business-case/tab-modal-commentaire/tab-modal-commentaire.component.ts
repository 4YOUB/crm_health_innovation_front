import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ms-tab-modal-commentaire',
  templateUrl: './tab-modal-commentaire.component.html',
  styleUrls: ['./tab-modal-commentaire.component.scss']
})
export class TabModalCommentaireComponent implements OnInit {
  commentaire
  constructor(public dialogRef: MatDialogRef<TabModalCommentaireComponent>,) { }

  ngOnInit(): void {
  }

}
