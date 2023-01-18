import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ms-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent implements OnInit {
  listeUser
  mode
  nom_utilisateur
  constructor(public dialogRef: MatDialogRef<ModalUserComponent>,) { }

  ngOnInit(): void {
  }

}
