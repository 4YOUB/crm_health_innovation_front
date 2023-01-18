import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ms-tab-modal-note',
  templateUrl: './tab-modal-note.component.html',
  styleUrls: ['./tab-modal-note.component.scss']
})
export class TabModalNoteComponent implements OnInit {
  commentaire
  constructor(public dialogRef: MatDialogRef<TabModalNoteComponent>,) { }

  ngOnInit(): void {
  }
}
