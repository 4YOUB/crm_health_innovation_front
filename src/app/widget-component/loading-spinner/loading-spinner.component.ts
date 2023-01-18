import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {
  @Input("mode_loading") mode_loading: String;
  constructor() { }

  ngOnInit(): void {
  }

}
