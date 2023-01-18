import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ms-tri-list',
  templateUrl: './tri-list.component.html',
  styleUrls: ['./tri-list.component.scss']
})
export class TriListComponent implements OnInit {
  @Input('type_tri') type_tri: any;
  @Input('order_by') order_by: any;
  @Input('nom_tri') nom_tri: any;
  @Input('nom_order_by') nom_order_by: any;
  @Output() optionTri: EventEmitter<any> = new EventEmitter();

  click_show_tri = 0;

  constructor() { }

  ngOnInit(): void {
  }

  sort() {
    if(!(this.order_by == this.nom_order_by))
    this.click_show_tri = 0

    this.click_show_tri++;
    this.order_by = this.nom_order_by

    if (this.click_show_tri == 1) {
      this.type_tri = 'ASC';
    } else if (this.click_show_tri == 2) {
      this.type_tri = 'DESC';
    } else {
      this.type_tri = '';
      this.order_by = '';
      this.click_show_tri = 0;
    }
    const body = {
      type_tri: this.type_tri,
      order_by: this.order_by
    }
    this.optionTri.emit(body);
  }

}
